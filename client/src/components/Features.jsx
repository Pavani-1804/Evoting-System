import { FaShieldAlt } from "react-icons/fa";
import { MdSpeed } from "react-icons/md";
import { RiUserSettingsLine } from "react-icons/ri";

const Features = () => {
  const features = [
    {
      icon: <FaShieldAlt />,
      title: "Secure Voting",
      desc: "Multi-layered JWT verification combined with robust OTP email authentication guarantees your vote is securely logged.",
    },
    {
      icon: <MdSpeed />,
      title: "Real-time Tallying",
      desc: "Experience instant vote calculations and immediate result dispatch with our hyper-efficient backend endpoints.",
    },
    {
      icon: <RiUserSettingsLine />,
      title: "Role-Based Integrity",
      desc: "Strict administrative privilege controls ensure voter anonymity while keeping candidate rosters fully auditable.",
    },
  ];

  return (
    <section id="features" className="px-6 md:px-20 py-24 text-center relative z-10">
      
      <div className="max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-5xl font-extrabold text-aqua drop-shadow-[0_0_15px_rgba(0,245,212,0.2)]">
          Why Choose Votexa?
        </h2>
        <p className="text-gray-400 mt-4 text-sm md:text-base">
          Our architecture combines cryptographic integrity with a seamless interface, setting a new standard for modern digital elections.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((f, i) => (
          <div
            key={i}
            className="glass-card p-8 rounded-2xl flex flex-col justify-between text-left"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-aqua/10 border border-aqua/30 text-2xl text-aqua mb-6 flex items-center justify-center">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
            
            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-500">
              <span>active_system</span>
              <span className="text-aqua">100% verified</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;