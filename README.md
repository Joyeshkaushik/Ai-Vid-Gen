# 🎬 AI Short Video Generator

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)](https://tailwindcss.com/)
[![Convex](https://img.shields.io/badge/Convex-Backend-orange)](https://convex.dev/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

> A powerful AI-powered SaaS application for automating YouTube Shorts creation with Next.js, React, Tailwind CSS, and Convex.

**Live Demo:** [aishortsvid.com](https://www.aishortsvid.com) | **Course Platform:** [aigurulab.tech](https://www.aigurulab.tech)

![AI Short Video Generator](https://img.shields.io/badge/Status-Production-success)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🌟 Overview

AI Short Video Generator is a full-stack SaaS application that automates the creation of engaging short-form video content. Leveraging cutting-edge AI technologies, this platform enables users to generate YouTube Shorts, TikTok videos, and Instagram Reels effortlessly.

### Key Highlights

- 🤖 AI-powered video generation
- 🎨 Automatic caption generation
- 🖼️ AI image creation
- 🎵 Audio MP3 generation
- 💳 PayPal payment integration
- 📊 User credit management system
- 🎬 Video rendering with Remotion
- 🌙 Dark mode support

## ✨ Features

### Core Functionality

- **AI Video Generation**: Create short videos automatically using AI
- **Caption Generation**: AI-powered subtitle and caption creation
- **Image Prompt Generation**: Generate creative image prompts using AI
- **AI Image Creation**: Create custom images for your videos
- **Audio Generation**: Generate MP3 audio files for video content
- **Video Rendering**: Professional video rendering with Remotion
- **Real-time Preview**: Play and preview videos before rendering

### User Features

- **Authentication**: Secure user authentication system
- **Dashboard**: Intuitive user dashboard with sidebar and header
- **Video Management**: View and manage all your created videos
- **Credit System**: User credit management for API usage
- **Payment Gateway**: Integrated PayPal payment system
- **Dark Mode**: Beautiful dark mode interface

### Technical Features

- **Responsive Design**: Mobile-first responsive design with Tailwind CSS
- **Convex Backend**: Real-time backend with Convex
- **Self-Hosting**: Convex self-hosting support
- **Inngest Integration**: Background job processing with Inngest
- **Form Validation**: Robust form handling and validation
- **Status Tracking**: Track video generation status in real-time

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 14
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Video Rendering**: Remotion
- **Icons**: Lucide React

### Backend

- **Database & Backend**: Convex
- **Background Jobs**: Inngest
- **Authentication**: Convex Auth

### Payment

- **Payment Gateway**: PayPal

### AI Services

- AI Caption Generation
- AI Image Generation
- AI Audio Generation
- AI Prompt Engineering

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18.x or higher
- npm or yarn
- Git

You'll also need accounts for:

- [Convex](https://convex.link/tubeguruji)
- [Inngest](https://innge.st/yt-tg2)
- PayPal Developer Account
- AI API keys (for image, audio, and caption generation)

## 🚀 Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/ai-short-video-generator.git
cd ai-short-video-generator
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Convex
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

# Inngest
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=

# AI API Keys
AI_CAPTION_API_KEY=
AI_IMAGE_API_KEY=
AI_AUDIO_API_KEY=

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Set up Convex**

```bash
npx convex dev
```

5. **Run the development server**

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## ⚙️ Configuration

### Convex Setup

1. Create a Convex account at [convex.dev](https://convex.dev)
2. Initialize Convex in your project:
   ```bash
   npx convex dev
   ```
3. Deploy your Convex functions:
   ```bash
   npx convex deploy
   ```

### Inngest Setup

1. Sign up at [inngest.com](https://inngest.com)
2. Get your event key and signing key
3. Add them to your `.env.local` file
4. Configure Inngest functions for:
   - Audio MP3 generation
   - Caption generation
   - Image prompt generation
   - AI image generation
   - Video data processing

### PayPal Configuration

1. Create a PayPal Developer account
2. Create a REST API app
3. Copy your Client ID and Secret
4. Configure payment webhook endpoints

## 📱 Usage

### Creating a New Video

1. **Login/Register**: Authenticate to access the dashboard
2. **Navigate to Create**: Click "Create New Video" in the dashboard
3. **Fill the Form**: Enter video details, script, and preferences
4. **Generate**: Submit the form to start AI generation
5. **Monitor Progress**: Track generation status in real-time
6. **Preview**: Review the generated video
7. **Render**: Render the final video
8. **Download**: Download or share your video

### Managing Credits

- Purchase credits through the PayPal payment gateway
- Credits are deducted based on API usage
- View credit balance in your dashboard
- Automatic credit updates after each video generation

### Video Management

- View all your created videos in the dashboard
- Filter by status (pending, processing, completed)
- Play videos directly in the browser
- Delete or re-render videos

## 📁 Project Structure

```
ai-short-video-generator/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Dashboard pages
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # UI components
│   ├── dashboard/        # Dashboard components
│   └── video/            # Video-related components
├── convex/               # Convex backend functions
│   ├── schema.ts         # Database schema
│   ├── videos.ts         # Video functions
│   ├── users.ts          # User functions
│   └── payments.ts       # Payment functions
├── lib/                  # Utility functions
│   ├── utils.ts         # Helper functions
│   └── constants.ts     # App constants
├── public/              # Static assets
├── remotion/            # Remotion video components
│   ├── Composition.tsx  # Video composition
│   └── Root.tsx         # Remotion root
├── styles/              # Global styles
└── inngest/             # Inngest functions
    ├── audio.ts         # Audio generation
    ├── captions.ts      # Caption generation
    └── images.ts        # Image generation
```

## 🔌 API Documentation

### Convex Functions

#### `videos.create`
Creates a new video generation request.

```typescript
await convex.mutation.videos.create({
  title: string,
  script: string,
  duration: number,
  userId: string
});
```

#### `videos.list`
Retrieves user's video list.

```typescript
await convex.query.videos.list({
  userId: string
});
```

#### `videos.updateStatus`
Updates video generation status.

```typescript
await convex.mutation.videos.updateStatus({
  videoId: string,
  status: "pending" | "processing" | "completed" | "failed"
});
```

### Inngest Functions

#### `generateAudio`
Generates audio MP3 file.

#### `generateCaptions`
Creates captions for the video.

#### `generateImagePrompt`
Generates AI image prompts.

#### `generateAIImages`
Creates AI-generated images.

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub**

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Import to Vercel**

- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Add environment variables
- Deploy

3. **Configure Convex for Production**

```bash
npx convex deploy --prod
```

4. **Update Environment Variables**

Update your production environment variables with:
- Production Convex URL
- Production API keys
- Production PayPal credentials

### Deploy Convex Backend

```bash
npx convex deploy --prod
```

### Configure Custom Domain

1. Add your custom domain in Vercel settings
2. Update DNS records
3. Configure SSL certificate

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Follow ESLint configuration
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**TubeGuruji**

- Website: [tubeguruji.com](https://tubeguruji.com)
- YouTube: [@tubeguruji](https://youtube.com/@tubeguruji)
- Instagram: [@tubeguruji](https://instagram.com/tubeguruji)
- Discord: [Join Community](https://discord.gg/tubeguruji)

## 📞 Contact

For business inquiries: admin@tubeguruji.com

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Convex](https://convex.dev/) - Backend platform
- [Inngest](https://inngest.com/) - Background jobs
- [Remotion](https://remotion.dev/) - Video rendering
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [PayPal](https://developer.paypal.com/) - Payment processing

## 📚 Resources

- **Free Resources**: [Course Materials](https://dcmk.short.gy/ai-youtube-shor...)
- **Source Code**: [GitHub Repository](https://dcmk.short.gy/ai-youtube-shor...)
- **Active Lessons**: [TubeGuruji Pro](https://www.tubeguruji.com/course-pre...)
- **Eraser Doc**: [Project Documentation](https://app.eraser.io/workspace/EeirN...)

## ⭐ Support

If you find this project helpful, please give it a star ⭐ on GitHub!

---

**Built with ❤️ by TubeGuruji**

*Learn to build cutting-edge AI applications - Join TubeGuruji Pro!*
