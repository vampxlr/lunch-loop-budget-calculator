/**
 * Data migrations for schema updates and cleanup
 * Run these on app startup to ensure data consistency
 */

/**
 * Clean up old localStorage data with invalid UUID format
 * This migration handles the transition from old ID format (timestamp-random)
 * to new UUID v4 format
 */
export function migrateLocalStorageData(): void {
  if (typeof window === "undefined") return;

  try {
    // UUID regex for validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    // Migrate submissions
    const submissionsStr = localStorage.getItem("submissions");
    if (submissionsStr) {
      try {
        const submissions = JSON.parse(submissionsStr);
        const validSubmissions = submissions.filter((sub: any) => {
          if (!sub.id || !uuidRegex.test(sub.id)) {
            console.log(`[MIGRATION] Removing submission with invalid ID: ${sub.id}`);
            return false;
          }
          return true;
        });

        if (validSubmissions.length !== submissions.length) {
          const removed = submissions.length - validSubmissions.length;
          console.log(`[MIGRATION] Cleaned ${removed} invalid submissions from localStorage`);
          localStorage.setItem("submissions", JSON.stringify(validSubmissions));
        }
      } catch (error) {
        console.error("[MIGRATION] Error parsing submissions:", error);
      }
    }

    // Migrate events
    const eventsStr = localStorage.getItem("events");
    if (eventsStr) {
      try {
        const events = JSON.parse(eventsStr);
        const validEvents = events.filter((event: any) => {
          if (event.submission_id && !uuidRegex.test(event.submission_id)) {
            console.log(`[MIGRATION] Removing event with invalid submission_id: ${event.submission_id}`);
            return false;
          }
          return true;
        });

        if (validEvents.length !== events.length) {
          const removed = events.length - validEvents.length;
          console.log(`[MIGRATION] Cleaned ${removed} invalid events from localStorage`);
          localStorage.setItem("events", JSON.stringify(validEvents));
        }
      } catch (error) {
        console.error("[MIGRATION] Error parsing events:", error);
      }
    }

    console.log("[MIGRATION] localStorage cleanup completed");
  } catch (error) {
    console.error("[MIGRATION] Unexpected error:", error);
  }
}

/**
 * Run all migrations on app startup
 */
export function runMigrations(): void {
  console.log("[MIGRATION] Starting migrations...");
  migrateLocalStorageData();
  console.log("[MIGRATION] All migrations completed");
}
