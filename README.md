QuizWiz 🧠🎯
A modern, single-tenant quiz application built with React and Vite. Features smooth animations, responsive design, and an intuitive user interface for creating and taking quizzes.

https://vercelbadge.vercel.app/api/Maham-Liaqat/quizwiz
https://img.shields.io/badge/React-19.1.1-blue
https://img.shields.io/badge/Vite-7.1.2-purple

✨ Features
🎯 Core Functionality
Interactive Quiz Taking: Smooth, engaging quiz experience with real-time feedback

Quiz Management: Create, edit, and organize quizzes effortlessly

Responsive Design: Works perfectly on desktop, tablet, and mobile devices

Modern UI/UX: Clean, intuitive interface with smooth animations

🚀 Technical Features
Blazing Fast Performance: Built with Vite for optimal loading speeds

Smooth Scrolling: Integrated Lenis scroll for buttery-smooth navigation

TypeScript Ready: Full TypeScript support for better development experience

Tailwind CSS: Utility-first CSS framework for consistent styling

🎨 User Experience
Beautiful Animations: Carefully crafted animations using Framer Motion

Dark/Light Mode: Built-in theme support (ready for implementation)

Progress Tracking: Visual progress indicators during quizzes

Accessibility: WCAG compliant with proper ARIA labels and keyboard navigation

🛠 Tech Stack
Frontend Framework: React 19.1.1

Build Tool: Vite 7.1.2

Styling: Tailwind CSS

Routing: React Router DOM

Smooth Scroll: Lenis

Deployment: Vercel

🚀 Quick Start
Prerequisites
Node.js 18+

npm or yarn

Local Development
Clone the repository

bash
git clone https://github.com/Maham-Liaqat/QuizWiz.git
cd QuizWiz/client
Install dependencies

bash
npm install
Set up environment variables

bash
cp env.example .env
Edit .env with your configuration:

env
VITE_API_BASE_URL=http://localhost:4000
VITE_AUTH_ENABLED=true
VITE_ENV=development
Start development server

bash
npm run dev
Visit http://localhost:5173

Building for Production
bash
npm run build
npm run preview
🌐 Deployment
Vercel (Recommended)
The app is configured for seamless deployment on Vercel:

Push to GitHub

Connect repository to Vercel

Deploy automatically

Live Demo: quizwiz.vercel.app

Other Platforms
Netlify: Ready with proper configuration

GitHub Pages: Pre-configured with gh-pages

Traditional Hosting: Built files in dist/ folder

📁 Project Structure
text
client/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Route components
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Helper functions
│   ├── styles/        # Global styles and Tailwind config
│   └── assets/        # Images, icons, fonts
├── public/            # Static assets
├── dist/              # Production build (auto-generated)
└── configuration files
🔧 Configuration
Environment Variables
VITE_API_BASE_URL: Backend API endpoint

VITE_AUTH_ENABLED: Enable/disable authentication features

VITE_ENV: Environment (development|staging|production)

Vite Configuration
Optimized for performance with:

Code splitting

Asset optimization

Hot module replacement

TypeScript support

🎯 Usage
For Quiz Takers
Browse available quizzes

Start any quiz with one click

Answer questions with instant feedback

View results and progress

For Quiz Creators
Create new quizzes with easy form

Add multiple question types

Set time limits and scoring

Publish and share quizzes

🤝 Contributing
We welcome contributions! Please see our contributing guidelines for details.

Development Workflow
Fork the repository

Create a feature branch

Make your changes

Test thoroughly

Submit a pull request

📝 Scripts
npm run dev - Start development server

npm run build - Build for production

npm run preview - Preview production build

npm run lint - Run ESLint

npm run deploy - Deploy to GitHub Pages

🔮 Roadmap
Upcoming Features
User authentication system

Quiz sharing and embedding

Advanced analytics dashboard

Real-time collaboration

Offline capability

Progressive Web App (PWA)

In Progress
Core quiz functionality

Responsive design

Smooth animations

Vercel deployment

🐛 Troubleshooting
Common Issues
Build fails: Check Node.js version (requires 18+)

Assets not loading: Verify Vercel configuration

Styles broken: Run npm install to ensure all dependencies

Getting Help
Check existing GitHub issues

Create a new issue with detailed description

Include browser console errors if applicable

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
React team for the amazing framework

Vite team for the superb build tool

Tailwind CSS for the utility-first approach

Vercel for seamless deployment

Built with ❤️ by Maham Liaqat

For questions or support, please open an issue or contact the development team.