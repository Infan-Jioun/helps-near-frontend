<div align="center">

<img src="https://i.ibb.co/0p3gk3sh/logo.png" alt="Helps Near Logo" width="120" />

# 🚨 Helps Near

### Emergency Help Platform — Bangladesh

**Community-driven emergency response system connecting people in need with verified volunteers. Fast, reliable, and always nearby.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://helps-near-frontend.vercel.app/)

[🌐 Live Demo](https://helps-near-frontend.vercel.app/) · [🐛 Report Bug](https://github.com/your-username/helps-near-frontend/issues) · [✨ Request Feature](https://github.com/your-username/helps-near-frontend/issues)

</div>

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Pages & Routes](#-pages--routes)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🏥 About The Project

**Helps Near** is a community-driven emergency response platform built for Bangladesh. It connects people facing emergencies with nearby verified volunteers — quickly and reliably.

Whether it's a medical emergency, fire, accident, flood, or crime, Helps Near ensures that help is always just a few taps away. The platform is built with a mobile-first approach and real-time updates to maximize response speed in critical situations.

> ⚠️ **For life-threatening emergencies, always call [999](tel:999) first.**

---

## ✨ Features

### 🆘 Emergency Reporting
- Report emergencies instantly with location, type, and description
- Mark emergency as **Priority** for faster response
- Support for multiple emergency categories: **Medical, Fire, Accident, Flood, Crime, Other**

### 🙋 Volunteer System
- Register as a volunteer in your area
- Get **instantly notified** for nearby emergencies
- Accept and respond to emergency requests
- Build your volunteer profile and rating

### 🔐 Admin Verification
- All volunteers are verified by the admin team before they can respond
- Ensures community safety and trust

### 📍 Location-Based Matching
- Automatically finds the **closest verified volunteers** to an emergency
- Real-time volunteer tracking and estimated arrival time

### ⭐ Rating & Feedback
- Users can rate and thank volunteers after an emergency is resolved
- Builds a trusted community of responders

### 📡 Real-time Updates
- Live emergency feed showing recent reports from the community
- Real-time status updates: **Pending → In Progress → Resolved**

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** >= 18.x
- **npm** / **yarn** / **pnpm**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/helps-near-frontend.git
cd helps-near-frontend
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

Fill in the required values in `.env.local` (see [Environment Variables](#-environment-variables)).

4. **Run the development server**

```bash
npm run dev
```

5. **Open in browser**

```
http://localhost:3000
```

---

## 📁 Project Structure

```
helps-near-frontend/
├── app/                        # Next.js App Router
│   ├── (public)/               # Public pages layout
│   │   ├── page.tsx            # Home page
│   │   ├── emergency/          # Emergency listing
│   │   ├── volunteers/         # Volunteer listing
│   │   ├── about/              # About page
│   │   └── contact/            # Contact page
│   ├── dashboard/              # Protected dashboard
│   │   ├── user/               # User dashboard
│   │   │   └── create-emergency/
│   │   └── volunteer/          # Volunteer dashboard
│   └── volunteer-register/     # Volunteer registration
├── components/                 # Reusable components
│   ├── ui/                     # shadcn/ui components
│   ├── nav-main.tsx            # Sidebar navigation
│   └── ...
├── lib/                        # Utilities & config
│   ├── routes.ts               # Route definitions
│   └── utils.ts                # Helper functions
├── public/                     # Static assets
└── ...config files
```

---

## 🗺 Pages & Routes

| Route | Description | Access |
|---|---|---|
| `/` | Home / Landing page | Public |
| `/emergency` | Browse all emergencies | Public |
| `/emergency/[id]` | Emergency detail page | Public |
| `/volunteers` | Browse all volunteers | Public |
| `/volunteer-register` | Register as a volunteer | Public |
| `/about` | About Helps Near | Public |
| `/contact` | Contact page | Public |
| `/dashboard/user/create-emergency` | Report a new emergency | Auth Required |
| `/dashboard/volunteer` | Volunteer dashboard | Auth Required |

---

## 🔑 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# API Base URL
NEXT_PUBLIC_API_URL=https://your-backend-api.com

# Authentication
NEXT_PUBLIC_AUTH_SECRET=your_auth_secret

# Other configs
NEXT_PUBLIC_SITE_URL=https://helps-near-frontend.vercel.app
```

> ⚠️ Never commit `.env.local` to version control.

---

## 📦 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

---

## 🌐 Deployment

This project is deployed on **Vercel**.

### Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/helps-near-frontend)

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com/)
3. Add environment variables in Vercel dashboard
4. Deploy!

---

## 🤝 Contributing

Contributions are welcome and appreciated!

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

Please make sure your code follows the existing style and passes lint checks.

---

## 📞 Contact & Support

| Contact | Details |
|---|---|
| 📧 Email | help@near.com |
| 📍 Location | Dhaka, Bangladesh |
| 🚨 Emergency Hotline | [999](tel:999) |
| 🌐 Live Site | [helps-near-frontend.vercel.app](https://helps-near-frontend.vercel.app/) |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ for the people of Bangladesh

**[⬆ Back to top](#-helps-near)**

</div>
