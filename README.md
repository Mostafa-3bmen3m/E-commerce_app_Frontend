# ✨ LUMINA | Frontend Experience

This is the user-facing half of the LUMINA e-commerce app. It's built with React and Vite because speed is essential, but it doesn't sacrifice visual fidelity to get there. The entire interface feels premium, utilizing custom transitions, GSAP (GreenSock) staggered animations, and a dynamic three-theme system (Light, Dark, and a luxurious "Gold" mode).

---

## 🛠️ The Tech Stack

- **Framework**: `React.js` leveraging `TypeScript` for strong typing across components and store props.
- **Build Tool**: `Vite` for lightning-fast dev servers and hot module replacement.
- **Styling**: `Tailwind CSS 4.0` taking full advantage of the new theme block architecture to manage variables.
- **Animation**: `GSAP` to handle buttery smooth parallax scrolls, staggered entrance effects, and hover states.
- **State Management**: `Zustand` keeps our Cart, Watchlist, Authentication, and Theme state unified and fast without the Redux boilerplate.
- **Data Fetching**: `Axios` wrapped with custom interceptors to handle seamless JWT token refreshes in the background.

---

## 🏃‍♂️ Getting Started Locally

If you've grabbed the code and want to see the UI running on your own machine, follow these steps:

### 1. Install Dependencies
Make sure you're in the `/frontend` directory, and run:
```bash
npm install
```

### 2. Set Up Environment Variables
Create a file named `.env` in the root of the `/frontend` folder. You'll need to tell the app where the backend API lives:
```env
# If you are running the backend locally:
VITE_API_URL=http://localhost:5000/api

# Or, if you want to test against the live production backend:
# VITE_API_URL=https://your-railway-app.up.railway.app/api
```

### 3. Start the Development Server
Fire up the Vite server:
```bash
npm run dev
```

The terminal will spit out a local address (usually `http://localhost:5173`). Open that in your browser and you're good to go!

---

## 🎨 Theme Architecture

One of the cooler features of the frontend is how it manages its themes. Unlike a traditional toggle, we use three distinct CSS classes (`.light`, `.dark`, `.gold`) that are dynamically applied to the `<html>` root by the `useTheme.ts` store.

This allows us to leverage Tailwind's CSS variables down through the entire DOM tree, ensuring that gradients, text contrast, box-shadows, and background blur effects all instantly snap to the correct aesthetic without a single page reload.

---

## 🚀 Deployment

This half of the project is built to live on **Vercel**. When you push to the `main` branch:
1. Vercel automatically detects the Vite configuration.
2. It runs `npm run build` to generate the static files.
3. It serves them to edge networks across the globe.

Remember, if you ever change your domain, update the `CORS` settings on the backend!
