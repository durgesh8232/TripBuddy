import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

const GREETINGS = [
  "Hii! Ready for an adventure?",
  "Hii! Don't forget your sunglasses! 😎",
  "Hii! Your travel plan looks amazing! ✨",
  "Hii! Chai break time? ☕",
  "Hii! Keep exploring new places! 🚀",
];

export default function WalkingBuddy({ userName = "Traveler" }) {
  // Phase: "idle" | "walking-in" | "waving" | "walking-out"
  const [phase, setPhase] = useState("idle");
  const [greeting, setGreeting] = useState("");

  const startWalkSequence = () => {
    const randomMsg = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
    setGreeting(randomMsg);

    // 1. Enter from the left edge
    setPhase("walking-in");

    // 2. Stop at ~2.8s, turn, wave hand, and show "Hii!" speech bubble
    setTimeout(() => {
      setPhase("waving");
    }, 2800);

    // 3. Resume walking across toward the right screen edge
    setTimeout(() => {
      setPhase("walking-out");
    }, 6300);

    // 4. Fully clear offscreen and return to idle cooldown
    setTimeout(() => {
      setPhase("idle");
    }, 10000);
  };

  useEffect(() => {
    // Initial delay: starts around 50 seconds after opening the page
    const initialTimer = setTimeout(() => {
      startWalkSequence();
    }, 50000);

    // Repeating timer: triggers every 55-60 seconds
    const intervalTimer = setInterval(() => {
      startWalkSequence();
    }, 58000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  if (phase === "idle") return null;

  // Horizontal translation coordinates: left to right
  let positionStyle = {
    left: "-160px", // Starts fully offscreen on the left
    transition: "left 2.8s linear, opacity 0.4s ease",
    opacity: 1,
  };

  if (phase === "waving") {
    positionStyle = {
      left: "48px", // Pauses comfortably near the bottom-left corner
      transition: "none",
      opacity: 1,
    };
  } else if (phase === "walking-out") {
    positionStyle = {
      left: "calc(100vw + 160px)", // Moves completely offscreen past the right border
      transition: "left 3.7s linear, opacity 0.8s ease 3s",
      opacity: 1,
    };
  }

  const isWalking = phase === "walking-in" || phase === "walking-out";

  return (
    <div
      style={positionStyle}
      className="fixed bottom-6 z-40 flex items-end gap-3 pointer-events-none select-none"
    >
      {/* Cartoon Figure */}
      <div className="relative pointer-events-auto">
        <svg
          viewBox="0 0 140 160"
          className={`w-20 h-20 sm:w-24 sm:h-24 drop-shadow-2xl overflow-visible ${
            isWalking ? "animate-buddy-walk" : ""
          }`}
        >
          {/* Backpack on Buddy's Back */}
          <rect x="22" y="58" width="22" height="38" rx="7" fill="#047857" />
          <rect x="24" y="64" width="5" height="24" rx="2" fill="#10b981" />

          {/* Left Arm */}
          <g>
            <path
              d="M 38 75 Q 22 72 26 56"
              stroke="#10b981"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="26" cy="54" r="5.5" fill="#34d399" />
          </g>

          {/* Right Arm (Normal walking position vs. waving hand when greeting) */}
          <g className={phase === "waving" ? "animate-buddy-wave" : ""}>
            <path
              d={
                phase === "waving"
                  ? "M 102 75 Q 126 50 120 32"
                  : "M 102 75 Q 118 72 114 56"
              }
              stroke="#10b981"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
            />
            <circle
              cx={phase === "waving" ? 120 : 114}
              cy={phase === "waving" ? 30 : 54}
              r="5.5"
              fill="#34d399"
            />
          </g>

          {/* Main Jelly/Suitcase Body */}
          <rect x="36" y="45" width="68" height="72" rx="28" fill="#10b981" />

          {/* Cheerful Highlight */}
          <ellipse cx="70" cy="88" rx="20" ry="18" fill="#34d399" opacity="0.55" />

          {/* Cool Sunglasses */}
          <rect x="44" y="60" width="22" height="13" rx="4" fill="#0f172a" />
          <rect x="74" y="60" width="22" height="13" rx="4" fill="#0f172a" />
          <line x1="66" y1="66" x2="74" y2="66" stroke="#0f172a" strokeWidth="3" />
          <line x1="48" y1="63" x2="54" y2="69" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          <line x1="78" y1="63" x2="84" y2="69" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />

          {/* Smile */}
          <path
            d="M 60 84 Q 70 94 80 84"
            stroke="#0f172a"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Rosy Cheeks */}
          <circle cx="48" cy="78" r="4.5" fill="#f43f5e" opacity="0.65" />
          <circle cx="92" cy="78" r="4.5" fill="#f43f5e" opacity="0.65" />

          {/* Feet */}
          <ellipse cx="54" cy="124" rx="9" ry="5.5" fill="#047857" />
          <ellipse cx="86" cy="124" rx="9" ry="5.5" fill="#047857" />
        </svg>

        {/* Ambient Ground Shadow */}
        <div className="w-16 h-2 bg-slate-900/30 dark:bg-emerald-500/10 rounded-full blur-[2px] mx-auto mt-0.5" />
      </div>

      {/* Speech Bubble: Pops in when stopped and waving */}
      {phase === "waving" && (
        <div className="animate-bubble-pop mb-8 bg-white dark:bg-slate-900 border border-emerald-500/40 text-slate-800 dark:text-slate-100 px-4 py-2 rounded-2xl rounded-bl-none shadow-2xl text-xs font-bold max-w-[220px] pointer-events-auto">
          <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-extrabold uppercase tracking-wider mb-0.5">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Buddy says</span>
          </div>
          <p className="leading-snug">
            {greeting.replace("Traveler", userName || "friend")}
          </p>
        </div>
      )}
    </div>
  );
}