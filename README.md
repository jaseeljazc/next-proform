# ProFormAi 🏋️‍♂️

An AI-powered fitness and nutrition platform tailored for Indian users, offering personalized meal plans with authentic Indian cuisine, custom workout routines, and an intelligent AI chatbot for real-time fitness and nutrition guidance.

![ProFormAi](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-38B2AC)

##  Features

###  Indian Meal Planning
- **Personalized Nutrition**: Generate meal plans based on your goals (fat loss, muscle gain, maintenance)
- **Authentic Indian Cuisine**: Kerala-style recipes and traditional Indian foods
- **Diet Flexibility**: Support for vegetarian, eggetarian, and non-vegetarian diets
- **Budget Awareness**: Plans tailored to your budget (low, medium, high)
- **Macro Tracking**: Detailed calorie, protein, carbs, and fat breakdowns

###  Smart Workout Generation
- **AI-Powered Plans**: Custom workout routines based on your experience and goals
- **Equipment Adaptable**: Plans for full gym, home equipment, or bodyweight only
- **Multiple Splits**: Full body, upper/lower, push-pull-legs, and bro split options
- **Video Tutorials**: YouTube links for every exercise
- **Progressive Overload**: Track sets, reps, and weights week over week

###  Progress Tracking
- **Workout Logging**: Record every exercise, set, rep, and weight
- **Weekly Comparison**: Compare performance across different weeks
- **Volume Analysis**: Track total training volume and progression
- **History View**: Access complete workout history

### AI Fitness Coach
- **24/7 Chat Support**: Ask questions about fitness, nutrition, and recovery
- **Concise Answers**: Get straight-to-the-point advice (max 5 bullet points)
- **Context-Aware**: Maintains conversation history for better recommendations

###  Modern UI/UX
- **Dark Theme**: Sleek glassmorphism design with lime and cyan accents
- **Responsive**: Optimized for desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion powered transitions
- **Mobile-First**: Bottom navigation and floating chat button on mobile

##  Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom design tokens
- **Animations**: Framer Motion
- **UI Components**: Radix UI primitives
- **Form Handling**: Formik + Yup
- **Markdown**: react-markdown for chat responses

### Backend
- **API Routes**: Next.js API routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based auth with httpOnly cookies
- **Password Hashing**: bcryptjs
- **AI Integration**: OpenRouter API (configurable model)

### State Management
- **Auth**: React Context API (`AuthContext`)
- **Plans**: React Context API (`PlansContext`)
- **Toasts**: Custom toast hook

##  Installation

### Prerequisites
- Node.js 18+ 
- MongoDB database
- OpenRouter API key

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/proformai.git
cd proformai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/proformai

# Authentication
JWT_SECRET=your-secret-key-min-32-chars

# AI API
OPENROUTER_API_KEY=your-openrouter-api-key
OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
proformai/
├── app/
│   ├── (auth)/           # Authentication pages
│   │   └── auth/         # Login/signup page
│   ├── (protected)/      # Protected routes
│   │   ├── dashboard/    # Main dashboard
│   │   ├── meal-plans/   # Meal plan generator
│   │   ├── workouts/     # Workout generator
│   │   ├── progress/     # Progress tracking
│   │   ├── saved-plans/  # View all plans
│   │   └── chat-bot/     # AI chat
│   ├── (public)/         # Public pages
│   │   └── page.tsx      # Landing page
│   ├── api/              # API routes
│   │   ├── auth/         # Auth endpoints
│   │   ├── plans/        # Plan CRUD
│   │   ├── workouts/     # Workout endpoints
│   │   ├── chatbot/      # Chat endpoint
│   │   └── meal-plan/    # Meal generation
│   ├── globals.css       # Global styles
│   └── layout.tsx        # Root layout
├── components/
│   ├── ui/               # Reusable UI components
│   ├── SideBar.tsx       # Navigation sidebar
│   └── StatCard.tsx      # Dashboard stat card
├── context/
│   ├── AuthContext.tsx   # Auth state management
│   └── PlansContext.tsx  # Plans state management
├── hooks/                # Custom React hooks
├── lib/
│   ├── auth-utils.ts     # JWT and cookie helpers
│   ├── db.ts             # MongoDB connection
│   └── utils.ts          # Utility functions
├── models/               # Mongoose schemas
│   ├── User.ts
│   ├── MealPlan.ts
│   ├── WorkoutPlan.ts
│   └── WorkoutLog.ts
└── tailwind.config.ts    # Tailwind configuration
```

##  Core Functionality

### Authentication Flow
1. User signs up with email, password, and name
2. Password hashed with bcryptjs (12 rounds)
3. JWT token generated and stored in httpOnly cookie
4. Protected routes check authentication via middleware

### Meal Plan Generation
1. User inputs: age, gender, height, weight, goal, diet type, meals/day, budget
2. BMR calculated using Mifflin-St Jeor equation
3. TDEE adjusted based on goal (±300-500 kcal)
4. AI generates Kerala-style meal plan with macro breakdown
5. Plan saved to MongoDB and can be activated

### Workout Plan Generation
1. User selects: goal, experience, equipment, days/week, time/session, split
2. AI generates complete workout with exercises, sets, reps, rest times
3. YouTube tutorial links auto-generated for each exercise
4. Plan saved and can be activated for tracking

### Progress Tracking
1. User logs workout: select day, add exercises, record sets/reps/weight
2. Data saved with week number (calculated from year start)
3. Historical data grouped by week for comparison
4. Volume calculation: sum of (reps × weight) per exercise

##  Design System

### Colors
- **Primary**: Lime (82° 85% 45%) - Main accent
- **Secondary**: Cyan (192° 95% 45%) - Secondary accent
- **Background**: Dark (0° 0% 4%)
- **Destructive**: Red (0° 72% 51%)

### Components
- **Glass Cards**: `backdrop-filter: blur(12px)` with subtle borders
- **Glow Effects**: Box shadows with accent colors
- **Gradients**: Used for buttons and hero sections
- **Animations**: Smooth transitions with Framer Motion

### Typography
- **Headings**: Bold, gradient text for impact
- **Body**: Clean, readable with muted foreground
- **Monospace**: Code and technical data

##  Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens stored in httpOnly cookies
- CSRF protection via sameSite cookie attribute
- Environment variables for sensitive data
- API routes protected with auth middleware

##  Mobile Optimization

- **Top Bar**: Logo and logout button
- **Bottom Navigation**: 5 main routes
- **Floating Action Button**: Quick access to AI chat
- **Touch-Friendly**: Larger tap targets and spacing
- **Responsive Grid**: Adapts to screen size

##  Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy automatically

### Environment Variables on Production
```env
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-secret
OPENROUTER_API_KEY=your-api-key
OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free
NODE_ENV=production
```

##  Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

##  License

This project is licensed under the MIT License.

##  Acknowledgments

- **OpenRouter** for AI API access
- **Radix UI** for accessible components
- **Framer Motion** for animations
- **Vercel** for hosting

##  Contact

For questions or support, please open an issue on GitHub.

---
