# WeatherWise - AI Weather Assistant 🌤️

A premium, modern, and production-ready web application providing real-time weather forecasts, powered by OpenWeatherMap API and an intelligent heuristic-based AI text generation engine.

![Screenshot](/public/screenshot.png) <!-- Add your screenshot here -->

## ✨ Features

- **Real-time Data**: Current conditions (temp, humidity, wind, etc.) using OpenWeatherMap API.
- **Smart AI Insights**: AI-generated suggestions, a 0-100 Weather Score, and threshold-based Health Alerts for conditions like extreme temperatures or bad air quality/humidity.
- **7-Day Forecast**: A beautiful, interactive area chart using `Recharts`.
- **Hourly Forecast**: Scrollable visualization for what's coming next.
- **Voice Search**: Native browser speech recognition wrapper on the search bar.
- **Glassmorphism UI**: Beautiful frosted-glass aesthetic combined with dynamic animated gradient backgrounds depending on atmospheric conditions (e.g., cloudy, snowy, rainy).
- **Responsive Layout**: Designed mobile-first for all viewport sizes.
- **C/F Toggle**: Seamless metrics toggle.
- **State Persistence**: Uses `zustand` to remember your units and search history locally.

## 🛠️ Tech Stack

- **Framework**: React + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: Zustand
- **Requests**: Axios
- **API**: OpenWeatherMap

## 🚀 Getting Started

### Prerequisites

You will need Node.js (v18+ recommended).

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Get an API Key from [OpenWeatherMap](https://openweathermap.org/api)
4. Create a `.env` file in the root directory and add your key:
   ```env
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```
   *(Note: The app contains a free temporary placeholder key so it will work immediately out-of-the-box for demoing).*
5. Start the development server:
   ```bash
   npm run dev
   ```

## 🏗️ Folder Structure

- `/src/api` - Axios HTTP clients for OpenWeatherMap 
- `/src/components` 
  - `/ai` - AI Insight Widgets
  - `/weather` - Main weather visualizations
  - `/layout` - Header layout
  - `/ui` - Basic reusable atoms like `GlassCard`
- `/src/store` - Zustand state store
- `/src/utils` - Tailwind merger scripts and logic for AI heuristic generation
