# Installation Instructions

Complete installation guide for Lunch Loop.

## Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher (comes with Node.js)
- **Git**: For version control (optional)

Check your versions:
```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be 9.0.0 or higher
```

## Installation Steps

### 1. Navigate to Project Directory

```bash
cd lunch-loop
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase client
- shadcn/ui components
- next-themes
- And all other dependencies

**Expected time**: 1-3 minutes depending on internet speed

### 3. Create Environment File

**Windows:**
```bash
copy .env.example .env.local
```

**Mac/Linux:**
```bash
cp .env.example .env.local
```

### 4. Configure Environment (Optional)

Open `.env.local` and customize:

**Minimal Configuration (local-only mode):**
```env
# No changes needed - works out of the box!
```

**With Supabase:**
```env
SCHEMA_SOURCE=db
PERSISTENCE_MODE=db
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**With n8n Webhook:**
```env
N8N_WEBHOOK_URL=your-webhook-url
N8N_SHARED_SECRET=your-secret
```

**With Admin Auth:**
```env
ADMIN_AUTH_ENABLED=true
ADMIN_USERNAME=yourusername
ADMIN_PASSWORD=yourpassword
```

### 5. Run Development Server

```bash
npm run dev
```

You should see:
```
✓ Ready in 2.5s
○ Local:    http://localhost:3000
```

### 6. Open in Browser

Open [http://localhost:3000](http://localhost:3000)

You should see the Lunch Loop wizard!

## Verify Installation

### Test Wizard
1. Go to http://localhost:3000
2. Fill in email and phone
3. Complete all steps
4. View results page

### Test Dashboard
1. Go to http://localhost:3000/dashboard
2. Login with `admin` / `admin` (if auth enabled)
3. View submissions
4. Try Planner Editor

### Check Console
Open browser DevTools (F12) and check console for errors.
You should see no red errors.

## Common Installation Issues

### Issue: `npm install` fails

**Solution 1**: Clear npm cache
```bash
npm cache clean --force
npm install
```

**Solution 2**: Delete node_modules and try again
```bash
rm -rf node_modules
npm install
```

**Solution 3**: Use different registry
```bash
npm install --registry=https://registry.npmjs.org/
```

### Issue: Port 3000 already in use

**Solution**: Use different port
```bash
npm run dev -- -p 3001
```

Or find and kill process using port 3000:

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

### Issue: Module not found errors

**Solution**: Reinstall dependencies
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### Issue: TypeScript errors

**Solution**: Restart TS server in VS Code
- Press `Ctrl+Shift+P` (Cmd+Shift+P on Mac)
- Type "TypeScript: Restart TS Server"
- Press Enter

### Issue: Styles not loading

**Solution**: Clear Next.js cache
```bash
rm -rf .next
npm run dev
```

### Issue: Environment variables not working

**Solutions**:
1. Ensure file is named `.env.local` (not `.env`)
2. Restart dev server after changes
3. Check for typos in variable names
4. Don't use quotes around values

## Build for Production

### 1. Build the application

```bash
npm run build
```

This will:
- Compile TypeScript
- Bundle JavaScript
- Optimize assets
- Generate static pages

**Expected time**: 30-60 seconds

### 2. Test production build locally

```bash
npm run start
```

Open http://localhost:3000 to test production build.

### 3. Check for errors

Look for any build warnings or errors in the console.
Fix any issues before deploying.

## Deployment

See README.md for deployment instructions for:
- Vercel
- Netlify
- Docker
- Traditional hosting

## Updating Dependencies

To update all dependencies to latest versions:

```bash
npm update
```

To check for outdated packages:

```bash
npm outdated
```

To update specific package:

```bash
npm install package-name@latest
```

## Uninstallation

To remove the project:

1. Stop development server (Ctrl+C)
2. Delete project folder

To remove global npm packages (if any were installed):

```bash
npm ls -g --depth=0  # List global packages
npm uninstall -g package-name  # Remove if needed
```

## Development Tools

### Recommended VS Code Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

### Recommended Browser Extensions

- React Developer Tools
- Redux DevTools (if using Redux)

## Getting Help

If you encounter issues:

1. Check this installation guide
2. Read QUICK_START.md
3. Check README.md
4. Review PROJECT_SUMMARY.md
5. Check browser console for errors
6. Check terminal for errors

## System Requirements

### Minimum
- 4GB RAM
- 2GB free disk space
- Modern browser (last 2 versions)

### Recommended
- 8GB RAM
- 5GB free disk space
- Chrome/Edge/Firefox latest version
- Fast internet connection

## Next Steps

After successful installation:

1. Read QUICK_START.md for usage guide
2. Read FEATURES.md for feature documentation
3. Explore the codebase
4. Try customizing the schema
5. Set up Supabase (optional)
6. Configure n8n webhook (optional)
7. Deploy to Vercel

## Support

For issues or questions:
- Check documentation files
- Review code comments
- Check console for errors
- Verify environment variables

---

Happy coding! 🚀
