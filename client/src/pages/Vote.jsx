import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API_BASE_URL } from "../config";

const Vote = () => {
  const [candidates, setCandidates] = useState([]);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Search state
  const [search, setSearch] = useState("");
  
  // Scheduling state
  const [settings, setSettings] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [electionStatus, setElectionStatus] = useState("Upcoming"); // Upcoming, Live, Completed

  // Modal / Selected Candidate state
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Feedback state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const token = localStorage.getItem("token");

  // Backtyping effect setup
  const words = [settings?.title || "Cast Your Vote", "Secure Digital Ballot", "Decentralized Ledger"];
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
  }, [subIdx, reverse, wordIdx, settings]);

  useEffect(() => {
    setTypedHeader(words[wordIdx].substring(0, subIdx));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subIdx, wordIdx]);

  // FETCH ALL DATA
  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch voter profile to see if they've voted
      const profileRes = await axios.get(`${API_BASE_URL}/api/users/profile`, {
        headers: { Authorization: token },
      });
      setVoted(profileRes.data.hasVoted);

      // Fetch candidates
      const candRes = await axios.get(`${API_BASE_URL}/api/candidates`);
      setCandidates(candRes.data);

      // Fetch election settings
      const settingsRes = await axios.get(`${API_BASE_URL}/api/candidates/election-settings`);
      setSettings(settingsRes.data);
    } catch (err) {
      console.error("Error loading voting page:", err);
      toast.error("Failed to load voting data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // COUNTDOWN TIMER EFFECT
  useEffect(() => {
    if (!settings) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(settings.startDate).getTime();
      const end = new Date(settings.endDate).getTime();

      if (now < start) {
        setElectionStatus("Upcoming");
        const diff = start - now;
        setTimeRemaining(formatTime(diff));
      } else if (now >= start && now <= end) {
        setElectionStatus("Live");
        const diff = end - now;
        setTimeRemaining(formatTime(diff));
      } else {
        setElectionStatus("Completed");
        setTimeRemaining("Election Completed");
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [settings]);

  // HELPER FORMAT TIME
  const formatTime = (ms) => {
    const totalSecs = Math.floor(ms / 1000);
    const secs = totalSecs % 60;
    const totalMins = Math.floor(totalSecs / 60);
    const mins = totalMins % 60;
    const totalHours = Math.floor(totalMins / 60);
    const hours = totalHours % 24;
    const days = Math.floor(totalHours / 24);

    return `${days > 0 ? `${days}d ` : ""}${hours}h ${mins}m ${secs}s`;
  };

  // VOTE FUNCTION
  const handleVote = async (id) => {
    if (electionStatus !== "Live") {
      toast.error("Voting is only allowed during live elections!");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/vote/${id}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );

      toast.success("Vote submitted successfully!");
      setVoted(true);
      
      // Update local storage user details
      const userJson = localStorage.getItem("user");
      if (userJson) {
        const user = JSON.parse(userJson);
        user.hasVoted = true;
        localStorage.setItem("user", JSON.stringify(user));
      }
      
      // Open feedback questionnaire popup
      setShowFeedbackModal(true);
      
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error casting vote");
    }
  };

  // SUBMIT FEEDBACK
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackMsg.trim()) return;
    setSubmittingFeedback(true);
    try {
      await axios.post(`${API_BASE_URL}/api/feedback`, {
        message: feedbackMsg,
        rating: feedbackRating
      }, {
        headers: { Authorization: token }
      });
      toast.success("Thank you for your feedback!");
      setShowFeedbackModal(false);
      setFeedbackMsg("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit feedback");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  // FILTERED CANDIDATES
  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.party.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white digital-grid">
      <Navbar />

      <div className="px-10 pt-32 pb-20 max-w-6xl mx-auto">
        <h1 className="text-4xl text-center text-aqua mb-2 font-bold drop-shadow-[0_0_15px_#00f5d4] min-h-[50px]">
          {typedHeader}
          <span className="text-aqua animate-pulse">|</span>
        </h1>
        <p className="text-center text-gray-400 mb-6 text-sm">
          {settings?.description || "Select a candidate and cast your secure ballot. You can only vote once."}
        </p>

        {/* TIMER BAR */}
        {settings && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-white/5 border border-aqua/20 rounded-xl text-center backdrop-blur-md">
            <span className="text-xs text-gray-400 font-semibold block mb-1">
              ELECTION STATUS:{" "}
              <span className={`uppercase font-bold ${
                electionStatus === "Live" ? "text-green-400" :
                electionStatus === "Upcoming" ? "text-yellow-400" : "text-red-500"
              }`}>
                {electionStatus}
              </span>
            </span>
            <p className="text-2xl font-mono font-bold text-aqua drop-shadow-[0_0_8px_#00f5d4]">
              {electionStatus === "Upcoming" ? `Starts In: ${timeRemaining}` : 
               electionStatus === "Live" ? `Ends In: ${timeRemaining}` : 
               "Election Completed"}
            </p>
          </div>
        )}

        {/* SEARCH BAR */}
        <div className="max-w-md mx-auto mb-10">
          <input
            type="text"
            placeholder="🔍 Search candidate name or party..."
            className="w-full p-3 bg-white/5 border border-aqua/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-aqua"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center text-aqua mt-10">Loading ballot details...</div>
        ) : filteredCandidates.length === 0 ? (
          <p className="text-center text-gray-500">No candidates match your search.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {filteredCandidates.map((c) => (
              <div
                key={c._id}
                className="group p-6 bg-gradient-to-br from-white/5 to-white/[0.02] border border-aqua/10 rounded-2xl
                backdrop-blur-md hover:shadow-[0_15px_30px_rgba(0,245,212,0.15)] hover:border-aqua/50
                hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-4 items-center mb-4">
                    <div className="relative overflow-hidden rounded-full w-16 h-16 border-2 border-aqua/20 group-hover:border-aqua/80 transition-all duration-500">
                      <img
                        src={c.photo || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(c.name)}`}
                        alt={c.name}
                        className="w-full h-full bg-black object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl text-aqua font-bold leading-tight group-hover:text-white transition-colors duration-300">
                        {c.name}
                      </h2>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Party: <span className="text-white font-semibold">{c.party}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative p-3 bg-black/40 border border-white/5 rounded-xl text-xs text-gray-400 italic mb-1 group-hover:bg-black/60 transition-colors duration-300">
                    <span className="text-lg text-aqua/30 absolute top-0.5 left-1.5 font-serif">“</span>
                    <p className="pl-4 pr-2 line-clamp-3 leading-relaxed">
                      {c.manifesto || "No manifesto statement submitted."}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedCandidate(c)}
                    className="mt-3 text-xs text-aqua hover:text-white transition-colors font-semibold flex items-center gap-1 focus:outline-none cursor-pointer"
                  >
                    View Full Profile & Manifesto <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </button>
                </div>

                <div className="mt-6">
                  <button
                    disabled={voted || electionStatus !== "Live"}
                    onClick={() => handleVote(c._id)}
                    className={`w-full py-3 rounded-lg font-bold transition duration-300 cursor-pointer
                    ${
                      voted || electionStatus !== "Live"
                        ? "bg-gray-800 text-gray-500 border border-white/5 cursor-not-allowed"
                        : "bg-aqua text-black hover:shadow-[0_0_20px_#00f5d4] hover:scale-[1.02]"
                    }`}
                  >
                    {electionStatus === "Upcoming" ? "Election Upcoming" :
                     electionStatus === "Completed" ? "Election Completed" :
                     voted ? "Already Voted" : "Vote Now"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MANIFESTO MODAL */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-aqua/30 max-w-lg w-full p-8 rounded-2xl relative shadow-[0_0_50px_rgba(0,245,212,0.15)] animate-fade-in">
            <button 
              onClick={() => setSelectedCandidate(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl focus:outline-none cursor-pointer"
            >
              ✕
            </button>
            
            <div className="flex gap-4 items-center mb-6">
              <img
                src={selectedCandidate.photo || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(selectedCandidate.name)}`}
                alt={selectedCandidate.name}
                className="w-20 h-20 rounded-full border border-aqua/30 bg-black object-cover"
              />
              <div>
                <h3 className="text-2xl text-aqua font-bold">{selectedCandidate.name}</h3>
                <p className="text-sm text-gray-400">Contesting Party: <span className="text-white font-semibold">{selectedCandidate.party}</span></p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6 text-center text-xs">
              <div className="p-2.5 bg-white/5 rounded-lg border border-white/5">
                <span className="text-gray-400 block mb-0.5">Age</span>
                <span className="font-bold text-white text-sm">{selectedCandidate.age || "N/A"}</span>
              </div>
              <div className="p-2.5 bg-white/5 rounded-lg border border-white/5">
                <span className="text-gray-400 block mb-0.5">Education</span>
                <span className="font-bold text-white text-sm truncate block">{selectedCandidate.education || "N/A"}</span>
              </div>
              <div className="p-2.5 bg-white/5 rounded-lg border border-white/5">
                <span className="text-gray-400 block mb-0.5">Experience</span>
                <span className="font-bold text-white text-sm truncate block">{selectedCandidate.experience || "N/A"}</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm text-aqua font-bold mb-3 flex items-center gap-2">
                📜 Manifesto & Agenda Statement
              </h4>
              <div className="text-sm text-gray-300 leading-relaxed max-h-48 overflow-y-auto pr-2 bg-black/60 p-5 rounded-xl border border-aqua/20 shadow-inner">
                {selectedCandidate.manifesto ? (
                  selectedCandidate.manifesto.split("\n").map((para, i) => (
                    <p key={i} className="mb-3 last:mb-0 text-gray-300 leading-relaxed">
                      {para}
                    </p>
                  ))
                ) : (
                  <p className="italic text-gray-500 text-center py-4">This candidate has not provided a written manifesto statement.</p>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedCandidate(null)}
              className="w-full py-2.5 bg-aqua text-black font-bold rounded-lg hover:shadow-[0_0_10px_#00f5d4] transition duration-300 cursor-pointer text-sm"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}

      {/* FEEDBACK MODAL */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-aqua/30 max-w-md w-full p-8 rounded-2xl relative shadow-[0_0_50px_rgba(0,245,212,0.15)] animate-fade-in">
            <h3 className="text-2xl text-aqua font-bold mb-2 text-center">Share Your Feedback</h3>
            <p className="text-xs text-gray-400 text-center mb-6">
              Thank you for casting your vote! Please rate your experience to help us improve.
            </p>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-mono uppercase text-center">Rating</label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className={`text-3xl transition duration-200 cursor-pointer ${
                        star <= feedbackRating ? "text-aqua drop-shadow-[0_0_5px_#00f5d4]" : "text-gray-600"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-mono uppercase">Comments</label>
                <textarea
                  required
                  rows={4}
                  className="w-full p-3 bg-black/40 border border-aqua/20 rounded-xl text-white focus:outline-none focus:border-aqua focus:shadow-[0_0_15px_rgba(0,245,212,0.2)] transition duration-300 resize-none text-sm"
                  placeholder="Tell us about your voting experience..."
                  value={feedbackMsg}
                  onChange={(e) => setFeedbackMsg(e.target.value)}
                ></textarea>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="flex-1 py-2.5 bg-white/5 border border-white/10 text-gray-400 hover:text-white rounded-lg text-sm transition cursor-pointer"
                >
                  Skip
                </button>
                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="flex-1 py-2.5 bg-aqua text-black font-bold rounded-lg hover:shadow-[0_0_15px_#00f5d4] transition duration-300 cursor-pointer text-sm disabled:opacity-50"
                >
                  {submittingFeedback ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Vote;