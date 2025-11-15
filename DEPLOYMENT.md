# MindPulse AI Coach - Deployment Guide

This guide provides step-by-step instructions for deploying the MindPulse AI Coach application.

## Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works)
- Lovable AI account (for AI chat)
- Git repository set up
- Vercel or Netlify account (for hosting)

## Step 1: Set Up Supabase

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Create a new project
   - Note your project URL and anon key

2. **Run Database Migrations**
   ```bash
   # Install Supabase CLI if needed
   npm install -g supabase
   
   # Link to your project
   supabase link --project-ref your-project-ref
   
   # Push migrations
   supabase db push
   ```

3. **Verify Database Schema**
   - Check Supabase Dashboard > Table Editor
   - Verify all tables exist: profiles, chat_messages, check_ins, weekly_surveys, etc.

## Step 2: Deploy Edge Functions

1. **Deploy chat-coach function**
   ```bash
   supabase functions deploy chat-coach
   ```

2. **Deploy admin-coach function**
   ```bash
   supabase functions deploy admin-coach
   ```

3. **Deploy generate-nudges function**
   ```bash
   supabase functions deploy generate-nudges
   ```

4. **Set Edge Function Secrets**
   - Go to Supabase Dashboard > Edge Functions > Secrets
   - Add secret: `LOVABLE_API_KEY` = your Lovable API key
   - Get API key from https://lovable.dev

## Step 3: Configure Environment Variables

1. **Create .env file** (for local development)
   ```bash
   cp .env.example .env
   ```

2. **Fill in .env file**
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
   ```

3. **For Production** (Vercel/Netlify):
   - Add these same variables in your hosting platform's environment settings
   - Variables must start with `VITE_` to be accessible in the frontend

## Step 4: Build and Test Locally

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build for Production**
   ```bash
   npm run build
   ```

3. **Test Build Locally**
   ```bash
   npm run preview
   ```

4. **Verify Everything Works**
   - Test authentication
   - Test chat functionality
   - Test all pages load correctly

## Step 5: Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Or Connect GitHub Repository**
   - Go to https://vercel.com
   - Import your repository
   - Configure:
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`
   - Add environment variables
   - Deploy

## Step 6: Deploy to Netlify (Alternative)

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy**
   ```bash
   netlify deploy --prod
   ```

3. **Or Use Netlify Dashboard**
   - Go to https://app.netlify.com
   - Add new site from Git
   - Configure build settings
   - Add environment variables
   - Deploy

## Step 7: Post-Deployment Verification

1. **Test Authentication**
   - Sign up a new user
   - Sign in
   - Verify role-based routing works

2. **Test Chat**
   - Send a message
   - Verify AI responds
   - Check messages save to database

3. **Test All Features**
   - Daily check-ins
   - Weekly surveys
   - Goals management
   - Stats page
   - Admin features (if admin user)

4. **Check Error Logs**
   - Vercel/Netlify logs
   - Supabase Dashboard > Edge Functions > Logs
   - Browser console

## Step 8: Set Up Scheduled Jobs (Optional)

For the `generate-nudges` function to run automatically:

1. **Option A: Supabase Cron** (if available)
   - Set up in Supabase Dashboard
   - Schedule to run daily

2. **Option B: External Scheduler**
   - Use a service like cron-job.org
   - Call the function endpoint daily
   - URL: `https://your-project.supabase.co/functions/v1/generate-nudges`

## Troubleshooting

### Build Fails
- Check Node.js version (need 18+)
- Verify all dependencies installed
- Check for TypeScript errors: `npm run build`

### Environment Variables Not Working
- Ensure variables start with `VITE_`
- Restart dev server after adding variables
- Check hosting platform settings

### Edge Functions Not Working
- Verify secrets are set in Supabase Dashboard
- Check function logs in Supabase Dashboard
- Test function locally first

### Database Connection Issues
- Verify Supabase URL and key are correct
- Check RLS policies allow access
- Verify user is authenticated

## Next Steps

- Set up custom domain (optional)
- Configure analytics (optional)
- Set up monitoring (optional)
- Review security settings
- Plan for scaling

## Support

For issues:
1. Check Supabase Dashboard logs
2. Review browser console
3. Check edge function logs
4. Review this deployment guide

