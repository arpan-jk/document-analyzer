# PDF Analyzer Frontend

A modern, responsive web application for analyzing PDF documents using AI-powered chatbot interface. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🤖 **AI Chatbot Interface**: Interactive chat with LLM-powered document analysis
- 📄 **PDF Upload & Analysis**: Upload PDF documents and get intelligent insights
- 🌓 **Dark/Light Mode**: Toggle between themes with persistent storage
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **Real-time Chat**: Instant responses with loading indicators
- 🎨 **Modern UI**: Beautiful gradient backgrounds and smooth animations

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks
- **API**: Fetch API for backend communication

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend server running on port 8080

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
# Create .env.local file
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:8080" > .env.local
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles with dark mode support
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main chatbot interface
├── components/            # Reusable components
│   ├── ChatMessage.tsx    # Individual chat message component
│   ├── LoadingDots.tsx    # Loading animation component
│   └── ThemeToggle.tsx    # Theme toggle button
└── lib/                   # Utility functions
    └── api.ts            # API client functions
```

## API Endpoints

The frontend expects the following backend endpoints:

### POST /upload
Upload a PDF file for analysis.

**Request**: `FormData` with file
**Response**: 
```json
{
  "success": true,
  "fileName": "document.pdf",
  "fileSize": 1024000,
  "preview": "base64_preview_data",
  "message": "File uploaded successfully"
}
```

### POST /chat
Send a message to the chatbot.

**Request**:
```json
{
  "message": "What is this document about?",
  "fileName": "document.pdf"
}
```

**Response**:
```json
{
  "response": "This document is about...",
  "success": true
}
```

## Features in Detail

### Chat Interface
- Real-time message exchange with the AI
- Message timestamps and sender indicators
- Smooth scrolling to latest messages
- Loading indicators during AI processing

### File Upload
- Drag-and-drop or click to upload PDF files
- File validation (PDF only)
- Upload progress indicators
- File preview and management

### Theme System
- Light and dark mode support
- Persistent theme preference
- Smooth transitions between themes
- System-wide theme application

### Responsive Design
- Mobile-first approach
- Adaptive layouts for different screen sizes
- Touch-friendly interface elements
- Optimized for both desktop and mobile use

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

- `NEXT_PUBLIC_BACKEND_URL` - Backend server URL (default: http://localhost:8080)

### Styling

The application uses Tailwind CSS with custom dark mode support. Key styling features:

- Custom color schemes for light/dark modes
- Smooth animations and transitions
- Responsive design utilities
- Custom scrollbar styling

## Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

Or deploy to platforms like Vercel, Netlify, or any static hosting service.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
