# 🌍 TripBuddy — AI-Powered Indian Travel Co-Pilot

<div align="center">

<img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=650&q=80" alt="TripBuddy Banner" width="450" style="border-radius: 14px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);" />

<br/><br/>

<p align="center">
  <strong>Crafting culture-rich itineraries across India with pacing control, live Unsplash imagery, dynamic budgeting, and local dialect support.</strong>
</p>

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![OpenRouter](https://img.shields.io/badge/AI%20Engine-Llama%203.3%20%2F%20Mistral-7C3AED?style=for-the-badge&logo=openai&logoColor=white)](https://openrouter.ai/)
[![Unsplash API](https://img.shields.io/badge/Imagery-Unsplash%20API-000000?style=for-the-badge&logo=unsplash&logoColor=white)](https://unsplash.com/developers)

[Key Features](#-core-features) • [Pacing Engine](#-intelligent-pacing-bounds) • [Tech Stack](#-technology-stack) • [System Flow](#-architecture--data-flow) • [Quickstart](#-getting-started) • [API Reference](#-api-endpoints)

</div>

---

## 🌟 Overview

**TripBuddy** is a full-stack, AI-driven travel planning platform engineered specifically for Indian destinations. It replaces generic, surface-level travel guides with production-grade itinerary generation that respects travel duration, group dynamics, dietary needs, authentic local pricing (in INR), and realistic day pacing.

---

## 🚀 Core Features

- **🧠 Structured AI Planning**: Leverages OpenRouter (Llama 3.1, Llama 3.3, Mistral) with guaranteed JSON schema validation to eliminate hallucinations and formatting errors.
- **⏱️ Enforced Pacing Rules**: Prevents itinerary overload with deterministic pacing limits (min 2, max 5 spots per day).
- **📸 Contextual Real-World Photography**: Combines the **Unsplash API** (with verb-stripping filters like removing *"Visit"*, *"Explore"*) with an automated **Wikipedia API fallback** for Indian heritage temples, forts, and dams.
- **🔄 Instant Single-Activity Swapping**: Exchange any daytime or evening activity with an alternative spot without regenerating the rest of the plan.
- **💱 Live Multi-Currency Converter**: Real-time conversion between **INR (₹)**, **USD ($)**, and **EUR (€)** across overall totals, daily estimates, and category breakdowns.
- **🗣️ Audio Survival Phrasebooks**: Context-aware dialect cards (**Marathi** for Maharashtra circuits like Nashik/Pune, **Konkani** for Goa, **Hindi** for Northern destinations) equipped with browser text-to-speech audio pronunciation.
- **🎛️ Interactive Budget Tweaker**: Positioned below the interactive itinerary map, allowing real-time adjustment of stays, food, transit, and sightseeing allocations.
- **🕺 Interactive Mascots & Ambient Companions**: A dancing loader animation during generation and an ambient walking Buddy companion across the interface.
- **📄 Turnkey PDF Exports & Sharing**: Generates clean, printable multi-page trip itineraries alongside direct WhatsApp sharing.

---

## ⏱️ Intelligent Pacing Bounds

TripBuddy enforces daily activity count ranges based on user preference:

| Pacing Mode | Target Activities / Day | Experience Style |
| :--- | :---: | :--- |
| **Fast-Paced** | **4 – 5 Activities** | High-energy sightseeing covering all key landmarks and viewpoints |
| **Balanced** | **3 – 4 Activities** | Well-spaced mix of exploration, food tasting, and downtime |
| **Relaxed** | **2 – 3 Activities** | Slow travel focused on leisure, cafes, and scenic views |
| **Safety Bound** | **2 – 5 Places** | Global clamp preventing plan exhaustion or empty days |

---

## 🛠️ Technology Stack

### Frontend Client
* **Core**: React 18, Vite
* **Styling**: Tailwind CSS, PostCSS
* **Icons & UI**: Lucide React
* **Maps**: Leaflet & React-Leaflet
* **Export Utilities**: HTML2PDF, Web Audio / Speech Synthesis API

### Backend Server
* **Framework**: FastAPI (Python 3.10+)
* **Server**: Uvicorn (ASGI)
* **AI Orchestration**: OpenAI SDK via OpenRouter API
* **Data Layer**: SQLAlchemy ORM, PyMySQL
* **Database**: MySQL Server
* **Validation**: Pydantic v2

---

## 📐 Architecture & Data Flow

```text
┌─────────────────────────────────────────────────────────┐
│               React Frontend Client (Vite)              │
│   DayTabs  •  Timeline  •  BudgetTweaker  •  MapView    │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼  JSON / REST API
┌─────────────────────────────────────────────────────────┐
│                 FastAPI Backend Service                 │
│                                                         │
│   ├── Pacing Engine (enforces 2-5 spot limits)          │
│   ├── OpenRouter AI Client (JSON structured output)     │
│   └── Image Resolver Service:                           │
│         ├── 1. Sanitizes place names (removes verbs)    │
│         ├── 2. Queries Unsplash API                     │
│         └── 3. Fallback to Wikipedia OpenSearch API     │
└──────────────┬────────────────────────────┬─────────────┘
               │                            │
               ▼                            ▼
      ┌─────────────────┐          ┌──────────────────┐
      │  MySQL Database │          │  Unsplash / Wiki │
      │  Saved Trips    │          │  High-Res Photos │
      └─────────────────┘          └──────────────────┘
