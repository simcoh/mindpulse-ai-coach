# MindPulse AI Coach

A comprehensive AI-powered mental health coaching platform for employees, designed to support wellbeing, track progress, and provide personalized coaching through intelligent conversations.

## 🎯 Features

- **AI-Powered Chat Coach**: Personalized mental health coaching conversations
- **Daily Mood Check-ins**: Track your emotional wellbeing with daily mood selections
- **Weekly Surveys**: Comprehensive wellbeing assessments with AI-generated insights
- **Goals Management**: Set and track personal development goals
- **Moodmeter Score**: AI-calculated wellbeing score based on your data
- **Personalized Nudges**: AI-generated coaching messages and reminders
- **Admin Dashboard**: Team management tools for administrators
- **Analytics & Stats**: Visual insights into your wellbeing journey

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (for backend services)

### Installation

```bash
# Clone the repository
git clone https://github.com/simcoh/mindpulse-ai-coach.git

# Navigate to the project directory
cd mindpulse-ai-coach

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your Supabase credentials

# Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

## 📋 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
```

## 🛠️ Technology Stack

- **Frontend**: React 18.3 + TypeScript
- **Build Tool**: Vite 5.4
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **AI Integration**: Lovable AI Gateway
- **State Management**: React Query
- **Routing**: React Router v6

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Step-by-step deployment instructions
- [Deployment Architecture](./DEPLOYMENT_ARCHITECTURE.md) - Complete system architecture
- [API Implementation Guide](./ARCHITECT_API_IMPLEMENTATION_GUIDE.md) - API integration details
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - Feature implementation status

## 🏗️ Project Structure

```
mindpulse-ai-coach/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Application pages
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   └── integrations/   # Supabase client configuration
├── supabase/
│   ├── functions/      # Edge functions (AI integrations)
│   └── migrations/     # Database schema migrations
└── public/             # Static assets
```

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

## 🔗 Links

- **Repository**: https://github.com/simcoh/mindpulse-ai-coach
- **Issues**: https://github.com/simcoh/mindpulse-ai-coach/issues

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

Built with ❤️ for employee wellbeing
