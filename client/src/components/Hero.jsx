import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";

const Hero = () => {
  const navigate = useNavigate();
  
  // Backtyping effect setup
  const words = ["Digital Voting System", "Secure Ledger Ballots", "Decentralized Elections"];
  const [wordIdx, setWordIdx] = useState(0);
  const [subIdx, setSubIdx] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    if (subIdx === words[wordIdx].length + 1 && !reverse) {
      const timeout = setTimeout(() => setReverse(true), 2000);
      return () => clearTimeout(timeout);
    }

    if (subIdx === 0 && reverse) {
      setReverse(false);
      setWordIdx((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIdx((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 40 : 80);

    return () => clearTimeout(timeout);
  }, [subIdx, reverse, wordIdx]);

  useEffect(() => {
    setTypedText(words[wordIdx].substring(0, subIdx));
  }, [subIdx, wordIdx]);

  return (
    <section className="flex flex-col lg:flex-row items-center justify-between px-6 md:px-20 pt-32 pb-20 gap-12 relative z-10">
      
      {/* Left side text and CTA */}
      <div className="max-w-xl text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-aqua/10 border border-aqua/30 rounded-full text-aqua text-xs font-semibold mb-6 animate-pulse">
          <FaShieldAlt className="text-xs" /> Next-Gen Decentralized E-Voting
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight min-h-[110px] md:min-h-[130px]">
          Secure & Transparent <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-aqua via-teal-200 to-white drop-shadow-[0_0_20px_rgba(0,245,212,0.3)]">
            {typedText}
            <span className="text-aqua animate-ping">|</span>
          </span>
        </h1>

        <p className="mt-4 text-gray-400 text-sm md:text-base leading-relaxed max-w-md">
          Votexa delivers end-to-end verifiable elections. Empowering organizations with robust security, auditability, and ease of access.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <button 
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-aqua text-black rounded-xl font-bold hover:scale-105 hover:shadow-[0_0_25px_#00f5d4] transition duration-300 cursor-pointer text-sm"
          >
            Get Started
          </button>
          
          <a 
            href="#features" 
            className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-aqua/30 rounded-xl font-bold transition duration-300 flex items-center gap-2 text-sm"
          >
            Learn More
          </a>
        </div>
      </div>

      {/* Right side futuristic interactive visualization */}
      <div className="relative flex items-center justify-center w-full max-w-[420px] aspect-square">
        
        <svg viewBox="0 0 400 400" className="w-[380px] h-[380px] relative z-10">
          <defs>
            <linearGradient id="phoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f5d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00b8d4" stopOpacity="0.2" />
            </linearGradient>
            <radialGradient id="radialGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00f5d4" stopOpacity="0.12" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Radial Aura Glow */}
          <circle cx="200" cy="200" r="160" fill="url(#radialGlow)" />

          {/* Orbiting concentric circles */}
          <circle cx="200" cy="200" r="170" fill="none" stroke="rgba(0, 245, 212, 0.05)" strokeWidth="4" />
          <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(0, 245, 212, 0.08)" strokeWidth="3" strokeDasharray="10 5" className="animate-spin-slow" />
          <circle cx="200" cy="200" r="105" fill="none" stroke="rgba(0, 245, 212, 0.12)" strokeWidth="2" strokeDasharray="4 4" className="animate-spin-reverse" />

          {/* The Mobile Phone outline in center-right */}
          <g transform="translate(240, 200)">
            {/* Phone body with gradient stroke */}
            <rect x="-35" y="-60" width="70" height="120" rx="10" fill="rgba(12,12,12,0.85)" stroke="url(#phoneGrad)" strokeWidth="2" className="drop-shadow-[0_0_20px_rgba(0,245,212,0.3)]" />
            
            {/* Screen UI details */}
            <rect x="-30" y="-55" width="60" height="110" rx="8" fill="rgba(0,0,0,0.5)" />
            <line x1="-20" y1="-42" x2="20" y2="-42" stroke="rgba(0,245,212,0.25)" strokeWidth="2" />
            <line x1="-20" y1="-32" x2="5" y2="-32" stroke="rgba(0,245,212,0.15)" strokeWidth="1.5" />
            
            {/* Target Slot/Scanner indicator */}
            <rect x="-22" y="-12" width="44" height="34" rx="6" fill="rgba(0, 245, 212, 0.08)" stroke="rgba(0, 245, 212, 0.3)" strokeWidth="1" strokeDasharray="3 2" />
            {/* Success check */}
            <path d="M-6 5 L-2 9 L8 -1" fill="none" stroke="#00f5d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_4px_#00f5d4]" />
          </g>

          {/* Human Figure made with dots and hyphens */}
          <g transform="translate(130, 205)">
            {/* Head made of dots/hyphens */}
            <circle cx="0" cy="-55" r="18" fill="none" stroke="#00f5d4" strokeWidth="2.5" strokeDasharray="3 3" />
            <circle cx="0" cy="-55" r="9" fill="none" stroke="#00f5d4" strokeWidth="1" strokeDasharray="6 3" />
            
            {/* Torso made of dotted/hyphenated paths */}
            <path d="M-20 -30 L20 -30 L15 35 L-15 35 Z" fill="none" stroke="#00f5d4" strokeWidth="2.5" strokeDasharray="4 4" />
            {/* Spine / Center line */}
            <line x1="0" y1="-30" x2="0" y2="35" stroke="#00f5d4" strokeWidth="1.5" strokeDasharray="1 5" />

            {/* Arm dropping vote to the phone */}
            <path d="M15 -25 Q55 -45 95 -20 L102 -10" fill="none" stroke="#00f5d4" strokeWidth="2.5" strokeDasharray="2 3" />
            
            {/* Left arm rest */}
            <path d="M-18 -25 Q-35 -10 -25 20" fill="none" stroke="#00f5d4" strokeWidth="1.5" strokeDasharray="3 4" />
          </g>

          {/* Dropping ballot item (animation) */}
          <g className="ballot-drop">
            <rect x="228" y="110" width="24" height="32" rx="3" fill="#00f5d4" fillOpacity="0.9" stroke="#000" strokeWidth="0.5" className="drop-shadow-[0_0_8px_#00f5d4]" />
            <path d="M234 126 L238 130 L246 122" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Animation styles local to SVG */}
          <style>
            {`
              @keyframes spin-slow {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              @keyframes spin-reverse {
                from { transform: rotate(360deg); }
                to { transform: rotate(0deg); }
              }
              @keyframes ballot-fall {
                0% { transform: translateY(-45px); opacity: 0; }
                15% { opacity: 1; }
                65% { transform: translateY(75px); opacity: 1; }
                85%, 100% { transform: translateY(90px); opacity: 0; }
              }
              .animate-spin-slow {
                transform-origin: 200px 200px;
                animation: spin-slow 22s linear infinite;
              }
              .animate-spin-reverse {
                transform-origin: 200px 200px;
                animation: spin-reverse 16s linear infinite;
              }
              .ballot-drop {
                transform-origin: 240px 126px;
                animation: ballot-fall 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
              }
            `}
          </style>
        </svg>

        {/* Floating status tag */}
        <div className="absolute top-10 right-4 bg-black/75 border border-aqua/30 rounded-xl px-4 py-2 text-xs font-mono flex items-center gap-1.5 backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span> Broadcast: Active
        </div>

      </div>

    </section>
  );
};

export default Hero;