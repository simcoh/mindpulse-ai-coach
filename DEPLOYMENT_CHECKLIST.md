# MindPulse AI Coach - Final Deployment Checklist

Use this checklist to ensure everything is ready for deployment.

## ✅ Pre-Deployment Checklist

### Code Quality
- [x] All TypeScript errors resolved
- [x] All linting errors resolved
- [x] Build succeeds without errors
- [x] All features implemented
- [x] Error handling in place
- [x] Loading states added

### Supabase Configuration
- [ ] Supabase project created
- [ ] Database migrations applied (`supabase db push`)
- [ ] All tables verified in Supabase Dashboard
- [ ] RLS policies verified
- [ ] Edge function `chat-coach` deployed
- [ ] Edge function `admin-coach` deployed
- [ ] Edge function `generate-nudges` deployed
- [ ] `LOVABLE_API_KEY` secret set in Supabase Dashboard

### Environment Variables
- [ ] `.env` file created (for local development)
- [ ] `VITE_SUPABASE_URL` configured
- [ ] `VITE_SUPABASE_PUBLISHABLE_KEY` configured
- [ ] Environment variables set in hosting platform (Vercel/Netlify)

### Testing
- [ ] Authentication (sign up/sign in) works
- [ ] Chat functionality works
- [ ] Daily check-ins work
- [ ] Weekly surveys work
- [ ] Goals CRUD operations work
- [ ] Nudges display correctly
- [ ] Admin features work (if admin user)
- [ ] Stats page displays data
- [ ] All routes accessible
- [ ] Error handling works

## 🚀 Deployment Steps

### Step 1: Supabase Setup
```bash
# 1. Create project at https://supabase.com
# 2. Link local project
supabase link --project-ref your-project-ref

# 3. Push migrations
supabase db push

# 4. Deploy edge functions
supabase functions deploy chat-coach
supabase functions deploy admin-coach
supabase functions deploy generate-nudges

# 5. Set secrets in Supabase Dashboard
# Go to Edge Functions > Secrets > Add LOVABLE_API_KEY
```

### Step 2: Build Application
```bash
npm install
npm run build
npm run preview  # Test locally
```

### Step 3: Deploy to Hosting

**Vercel:**
```bash
vercel --prod
# Or connect GitHub repo in Vercel dashboard
```

**Netlify:**
```bash
netlify deploy --prod
# Or connect GitHub repo in Netlify dashboard
```

### Step 4: Configure Hosting Platform
- [ ] Set build command: `npm run build`
- [ ] Set output directory: `dist`
- [ ] Add environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] Configure custom domain (optional)
- [ ] Enable HTTPS (automatic with Vercel/Netlify)

## ✅ Post-Deployment Verification

### Functional Testing
- [ ] Homepage loads
- [ ] Authentication flow works
- [ ] User can sign up
- [ ] User can sign in
- [ ] Chat sends and receives messages
- [ ] Daily check-in prompts appear
- [ ] Weekly survey can be completed
- [ ] Goals can be created/edited/deleted
- [ ] Stats page shows data
- [ ] Admin dashboard accessible (for admin users)
- [ ] Admin chat works (for admin users)

### Performance Testing
- [ ] Page load times acceptable
- [ ] API responses are fast
- [ ] No console errors
- [ ] Images load correctly
- [ ] Mobile responsive

### Security Verification
- [ ] HTTPS enabled
- [ ] Environment variables not exposed
- [ ] API keys secured
- [ ] RLS policies working
- [ ] User data isolated

## 🔧 Optional Post-Deployment Setup

### Scheduled Jobs
- [ ] Set up cron job for `generate-nudges` function
  - Option A: Use Supabase Cron (if available)
  - Option B: Use external service (cron-job.org)
  - Schedule: Daily at appropriate time

### Monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure analytics (if desired)
- [ ] Set up uptime monitoring
- [ ] Configure log aggregation

### Documentation
- [ ] Update README with deployment info
- [ ] Document any custom configurations
- [ ] Create user guide (optional)
- [ ] Create admin guide (optional)

## 🐛 Troubleshooting

If something doesn't work:

1. **Check Error Logs**
   - Browser console
   - Hosting platform logs
   - Supabase Dashboard > Edge Functions > Logs

2. **Verify Configuration**
   - Environment variables set correctly
   - Supabase URL and key correct
   - Edge function secrets set

3. **Test Locally**
   - Run `npm run dev`
   - Test all features
   - Check for errors

4. **Common Issues**
   - Build fails: Check Node.js version (need 18+)
   - Environment vars not loading: Ensure they start with `VITE_`
   - Edge functions fail: Check secrets are set
   - Database errors: Verify RLS policies

## 📊 Success Criteria

✅ Application builds successfully  
✅ All features work in production  
✅ No critical errors in logs  
✅ Performance is acceptable  
✅ Security measures in place  

---

**Ready for Production**: ✅ Yes (after completing checklist)  
**Last Updated**: 2024

