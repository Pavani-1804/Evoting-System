import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API_BASE_URL } from "../config";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  // Backtyping effect setup
  const words = ["Voter Dashboard", "Identity Passport", "Verify Credentials"];
  const [wordIdx, setWordIdx] = useState(0);
  const [subIdx, setSubIdx] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [typedHeader, setTypedHeader] = useState("");

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subIdx, reverse, wordIdx]);

  useEffect(() => {
    setTypedHeader(words[wordIdx].substring(0, subIdx));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subIdx, wordIdx]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users/profile`, {
          headers: { Authorization: token }
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  return (
    <div className="min-h-screen bg-black text-white digital-grid flex flex-col justify-between">
      <div>
        <Navbar />
        
        <div className="px-6 md:px-10 pt-32 pb-20 max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold text-center text-aqua mb-12 drop-shadow-[0_0_15px_rgba(0,245,212,0.2)] min-h-[40px] md:min-h-[50px]">
            {typedHeader}
            <span className="text-aqua animate-pulse">|</span>
          </h1>

          {/* DUAL COLUMN PROFILE CARD / IDENTITY PASSPORT */}
          {user && (
            <div className="glass-card max-w-2xl mx-auto mb-12 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row items-center gap-6 md:gap-8 shadow-[0_0_35px_rgba(0,245,212,0.05)]">
              {/* Voter Avatar Photo */}
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-aqua/10 blur-md animate-pulse"></div>
                <img
                  src={user.photo || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.name)}`}
                  alt="Voter Avatar"
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-aqua/30 bg-black/40 object-cover relative z-10"
                />
              </div>

              {/* Voter Details */}
              <div className="flex-1 space-y-4 text-center md:text-left w-full">
                <div className="pb-3 border-b border-white/10">
                  <span className="text-[10px] text-aqua tracking-widest font-mono uppercase">Votexa Registered Voter ID</span>
                  <h2 className="text-xl md:text-2xl font-bold text-white mt-0.5">{user.name}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 text-xs font-mono uppercase">Gmail Address</span>
                    <p className="font-semibold text-gray-200 mt-0.5 break-all">{user.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs font-mono uppercase">Voting Status</span>
                    <div className="mt-1">
                      {user.hasVoted ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Verified Voted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full text-xs font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-ping"></span> Pending Ballot
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* CAST VOTE */}
            <div
              onClick={() => navigate("/vote")}
              className="glass-card p-6 md:p-8 rounded-2xl cursor-pointer"
            >
              <span className="text-[10px] text-aqua font-mono uppercase tracking-widest block mb-2">option.01</span>
              <h3 className="text-xl md:text-2xl font-bold text-white">Cast Your Vote</h3>
              <p className="text-gray-400 text-xs md:text-sm mt-2 leading-relaxed">
                Browse contesting candidates, review manifesto bios, and record your secure ballot.
              </p>
            </div>

            {/* LIVE RESULTS */}
            <div
              onClick={() => navigate("/results")}
              className="glass-card p-6 md:p-8 rounded-2xl cursor-pointer"
            >
              <span className="text-[10px] text-aqua font-mono uppercase tracking-widest block mb-2">option.02</span>
              <h3 className="text-xl md:text-2xl font-bold text-white">View Live Results</h3>
              <p className="text-gray-400 text-xs md:text-sm mt-2 leading-relaxed">
                Monitor real-time vote share metrics, leaderboards, and cryptographically verified logs.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;