import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const FAQ = () => {
  const [open, setOpen] = useState(null);

  const data = [
    { 
      q: "Is the voting system fully secure?", 
      a: "Absolutely. We utilize JSON Web Tokens (JWT) for secure session authorization, database-level hashing for credentials, and a mandatory 6-digit One-Time Password (OTP) verification for every single session authorization." 
    },
    { 
      q: "Can a user cast more than one ballot?", 
      a: "No. Votexa enforces strict single-vote assertions. The moment a ballot is successfully cast, the voter's database document has its 'hasVoted' attribute set to true, making subsequent voting requests impossible." 
    },
    { 
      q: "Who is authorized to create and manage candidates?", 
      a: "Only verified administrators can register new candidates, access the administrative console, or command an election reset. Standard accounts have read-only access to live results and ballot submission options." 
    },
  ];

  return (
    <section id="faq" className="px-6 md:px-20 py-24 relative z-10">
      
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-extrabold text-center text-aqua mb-16 drop-shadow-[0_0_15px_rgba(0,245,212,0.2)]">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4 max-w-4xl mx-auto">
          {data.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="glass-card rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <div className="p-6 flex justify-between items-center select-none">
                  <h3 className="text-base md:text-lg font-bold text-white pr-4">{item.q}</h3>
                  <div className={`text-aqua transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                    <FaChevronDown className="text-sm" />
                  </div>
                </div>

                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-[200px] border-t border-white/5 bg-white/[0.01]" : "max-h-0"
                  }`}
                >
                  <p className="p-6 text-sm text-gray-400 leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;