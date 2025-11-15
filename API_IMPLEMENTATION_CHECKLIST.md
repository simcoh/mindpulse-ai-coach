# MindPulse API Implementation - Quick Checklist

## 🔴 Critical (Must Complete First)

### Supabase Setup
- [ ] Create/verify Supabase project
- [ ] Get project URL and anon key
- [ ] Create `.env` file with:
  ```env
  VITE_SUPABASE_URL=your_url
  VITE_SUPABASE_PUBLISHABLE_KEY=your_key
  ```
- [ ] Run database migrations: `supabase db push`
- [ ] Verify all tables exist in Supabase Dashboard
- [ ] Test database connection from frontend

### AI Chat API
- [ ] Get Lovable API key from https://lovable.dev
- [ ] Deploy edge function: `supabase functions deploy chat-coach`
- [ ] Set secret in Supabase Dashboard:
  - Go to Edge Functions > chat-coach
  - Add secret: `LOVABLE_API_KEY` = your_key
- [ ] Test edge function via Dashboard or CLI
- [ ] Verify chat works in application

---

## 🟡 High Priority (Complete Next)

### Moodmeter Score
- [ ] Create `src/lib/moodmeter.ts` with calculation logic
- [ ] Replace random score in `EnhancedChatInterface.tsx` line 196
- [ ] Test score calculation with sample data
- [ ] Verify score saves to database correctly

### Nudges System
- [ ] Create `supabase/functions/generate-nudges/index.ts`
- [ ] Implement nudge generation logic
- [ ] Set up scheduled job (cron or Supabase scheduled function)
- [ ] Create `src/components/NudgesList.tsx` UI component
- [ ] Add nudges display to Dashboard
- [ ] Test nudge generation and display

### Goals Management
- [ ] Create `src/pages/Goals.tsx` page
- [ ] Create `src/components/GoalsList.tsx` component
- [ ] Create `src/components/GoalForm.tsx` component
- [ ] Add goals route to `App.tsx`
- [ ] Add goals link to sidebar
- [ ] Test CRUD operations

---

## 🟢 Medium Priority

### Voice Features
- [ ] Implement voice recording in `WeeklySurvey.tsx`
- [ ] Add Web Speech API or third-party service
- [ ] Implement voice call in `Coach.tsx`
- [ ] Add transcription service integration
- [ ] Add text-to-speech for AI responses
- [ ] Test voice features end-to-end

### Admin Chat AI
- [ ] Create `supabase/functions/admin-coach/index.ts`
- [ ] Update `AdminChat.tsx` to use real AI
- [ ] Add admin-specific system prompts
- [ ] Test admin chat responses

### Admin Dashboard Enhancements
- [ ] Add team mood trends chart
- [ ] Add risk alerts for low scores
- [ ] Add team comparison visualizations
- [ ] Add export functionality

---

## 🔵 Low Priority (Nice to Have)

### Real-time Features
- [ ] Add Supabase Realtime subscriptions
- [ ] Implement live chat updates
- [ ] Add real-time mood tracking

### Analytics
- [ ] Create analytics dashboard
- [ ] Add reporting functionality
- [ ] Implement data export

### Notifications
- [ ] Set up email notifications
- [ ] Add push notifications (if mobile)
- [ ] Add weekly survey reminders

---

## ✅ Testing Checklist

### Authentication
- [ ] Sign up works
- [ ] Sign in works
- [ ] Role-based routing works
- [ ] Session persistence works
- [ ] Logout works

### Chat Features
- [ ] User can send messages
- [ ] AI responds correctly
- [ ] Messages save to database
- [ ] Chat history loads on refresh
- [ ] Error handling works

### Daily Check-ins
- [ ] Mood prompt appears if no check-in today
- [ ] Mood selection saves correctly
- [ ] AI responds to mood appropriately

### Weekly Survey
- [ ] Survey prompt appears weekly
- [ ] All fields save correctly
- [ ] AI summary generates
- [ ] Moodmeter score calculates
- [ ] Voice input works (if implemented)

### Admin Features
- [ ] Admin can access admin dashboard
- [ ] Team member list loads
- [ ] Survey status displays correctly
- [ ] Admin chat works
- [ ] Admin weekly survey works

### Stats Page
- [ ] Mood chart displays
- [ ] Check-in streak shows
- [ ] Weekly survey status shows
- [ ] Data loads correctly

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All environment variables set
- [ ] Database migrations applied
- [ ] Edge functions deployed
- [ ] API keys configured
- [ ] Error handling complete
- [ ] Loading states added
- [ ] All tests passing

### Deployment
- [ ] Build frontend: `npm run build`
- [ ] Deploy to hosting platform
- [ ] Set environment variables in hosting
- [ ] Verify Supabase connection
- [ ] Test all features post-deployment

### Post-Deployment
- [ ] Monitor error logs
- [ ] Test authentication
- [ ] Test chat functionality
- [ ] Verify all user roles work
- [ ] Check performance

---

## 📝 Notes

- **Environment Variables**: Never commit `.env` file to git
- **API Keys**: Store only in Supabase secrets, never in frontend code
- **Testing**: Test each feature after implementation
- **Documentation**: Update this checklist as you complete items

---

**Quick Start Command**:
```bash
# 1. Set up environment
cp .env.example .env  # (create .env with your values)

# 2. Install dependencies
npm install

# 3. Run migrations
supabase db push

# 4. Deploy edge functions
supabase functions deploy chat-coach

# 5. Start dev server
npm run dev
```

