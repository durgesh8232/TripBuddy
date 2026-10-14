import React, { useState } from "react";
import { Languages, Volume2, Check } from "lucide-react";

const REGIONAL_PHRASEBOOKS = {
  Marathi: {
    language: "Marathi (मराठी)",
    tag: "Native to Maharashtra",
    phrases: [
      { english: "Hello / Greetings", local: "नमस्कार", phonetic: "Namaskar" },
      { english: "How much is this?", local: "हे कितीला आहे?", phonetic: "Hey kitila aahey?" },
      { english: "Where is this place?", local: "ही जागा कुठे आहे?", phonetic: "Hee jaaga kuthey aahey?" },
      { english: "Thank you very much!", local: "खूप खूप धन्यवाद!", phonetic: "Khup khup dhanyavaad!" },
      { english: "Is this vegetarian?", local: "हे शाकाहारी आहे का?", phonetic: "Hey shaakahari aahey kaa?" },
      { english: "Will you go by meter?", local: "मीटरने चालणार का?", phonetic: "Meter-ne chaalnaar kaa?" },
    ],
  },
  Hindi: {
    language: "Hindi (हिंदी)",
    tag: "Widely spoken across North & Central India",
    phrases: [
      { english: "Hello / Namaste", local: "नमस्ते", phonetic: "Namaste" },
      { english: "How much does it cost?", local: "यह कितने का है?", phonetic: "Yeh kitne ka hai?" },
      { english: "Where is the way to...?", local: "...का रास्ता कहाँ है?", phonetic: "...ka raasta kahan hai?" },
      { english: "Thank you!", local: "धन्यवाद / शुक्रिया", phonetic: "Dhanyavaad / Shukriya" },
      { english: "Please make it less spicy", local: "मिर्च कम रखना कृपया", phonetic: "Mirch kam rakhna kripya" },
      { english: "Please call a cab/auto", local: "ऑटो बुला दीजिए", phonetic: "Auto bula dijiye" },
    ],
  },
  Konkani: {
    language: "Konkani & Portuguese-English",
    tag: "Local dialect in Goa",
    phrases: [
      { english: "Hello / Good day", local: "देव बरे करूं", phonetic: "Deu boro dis dium" },
      { english: "How much is this?", local: "हाचो मोल कितलो?", phonetic: "Hacho mol kitlo?" },
      { english: "How are you?", local: "कसो आसा?", phonetic: "Koso asa?" },
      { english: "Thank you!", local: "देव बरे करूं", phonetic: "Dev bore korum" },
      { english: "Is this fresh?", local: "हें ताजें आसा?", phonetic: "Hem tajem asa?" },
    ],
  },
};

function getLanguageForDestination(destination = "") {
  const dest = destination.toLowerCase();
  if (
    dest.includes("nashik") ||
    dest.includes("pune") ||
    dest.includes("mumbai") ||
    dest.includes("mahabaleshwar") ||
    dest.includes("lonavala") ||
    dest.includes("shirdi")
  ) {
    return REGIONAL_PHRASEBOOKS.Marathi;
  }
  if (dest.includes("goa")) {
    return REGIONAL_PHRASEBOOKS.Konkani;
  }
  return REGIONAL_PHRASEBOOKS.Hindi;
}

export default function LocalPhrasesCard({ destination }) {
  const phrasebook = getLanguageForDestination(destination);
  const [playingIdx, setPlayingIdx] = useState(null);

  const speakPhrase = (text, idx) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.onend = () => setPlayingIdx(null);
    setPlayingIdx(idx);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-7 space-y-4 shadow-xl transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Languages className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Local Survival Phrases</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                {phrasebook.language}
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {phrasebook.tag} • Handy for local markets, drivers & street food
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {phrasebook.phrases.map((item, idx) => (
          <div
            key={idx}
            className="group relative bg-slate-50 dark:bg-slate-950/60 hover:bg-emerald-500/5 dark:hover:bg-emerald-500/10 border border-slate-200/80 dark:border-slate-800 p-3.5 rounded-2xl transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span className="font-medium">{item.english}</span>
                <button
                  type="button"
                  onClick={() => speakPhrase(item.phonetic, idx)}
                  className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-emerald-600 dark:text-emerald-400 transition"
                  title="Listen pronunciation"
                >
                  <Volume2
                    className={`w-3.5 h-3.5 ${
                      playingIdx === idx ? "animate-pulse text-emerald-500" : ""
                    }`}
                  />
                </button>
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {item.local}
              </div>
            </div>
            <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-2 bg-emerald-500/5 dark:bg-slate-900 px-2 py-1 rounded-md inline-block self-start">
              🗣️ "{item.phonetic}"
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}