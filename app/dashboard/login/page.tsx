import LoginClient from "./LoginClient";

export default function Page({
  searchParams,
}: {
  searchParams?: { next?: string };
}) {
  // Read next parameter from server-side searchParams
  const rawNext = typeof searchParams?.next === "string" ? searchParams.next : "";
  
  // Sanitize: only allow paths that start with "/" to prevent open-redirect attacks
  const nextPath = rawNext.startsWith("/") ? rawNext : "/dashboard";
  
  return <LoginClient nextPath={nextPath} />;
}
