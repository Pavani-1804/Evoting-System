import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API_BASE_URL } from "../config";

const Admin = () => {
  // Active Tab state
  const [activeTab, setActiveTab] = useState("schedule");

  // Candidate form state
  const [name, setName] = useState("");
  const [party, setParty] = useState("");
  const [age, setAge] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [manifesto, setManifesto] = useState("");
  const [photo, setPhoto] = useState("");
  const [imageMode, setImageMode] = useState("upload"); // upload | url
  const [motto, setMotto] = useState("");
  const [partySymbol, setPartySymbol] = useState("");
  const [symbolMode, setSymbolMode] = useState("upload"); // upload | url

  const [candidates, setCandidates] = useState([]);
  const [voters, setVoters] = useState([]);
  const [loadingVoters, setLoadingVoters] = useState(false);
  const [voterSearch, setVoterSearch] = useState("");

  // Election scheduling settings state
  const [elTitle, setElTitle] = useState("");
  const [elDescription, setElDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);

  // Backtyping effect setup
  const words = ["Admin Management Suite", "Configure Schedules", "Audit Ballot Parameters"];
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

  const token = localStorage.getItem("token");

  // FETCH ELECTION SETTINGS
  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/candidates/election-settings`);
      if (res.data) {
        setElTitle(res.data.title || "");
        setElDescription(res.data.description || "");
        
        if (res.data.startDate) {
          const sD = new Date(res.data.startDate);
          setStartDate(sD.toISOString().split("T")[0]);
          setStartTime(sD.toTimeString().split(" ")[0].substring(0, 5));
        }
        if (res.data.endDate) {
          const eD = new Date(res.data.endDate);
          setEndDate(eD.toISOString().split("T")[0]);
          setEndTime(eD.toTimeString().split(" ")[0].substring(0, 5));
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load election settings");
    }
  };

  // FETCH CANDIDATES
  const fetchCandidates = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/candidates`);
      setCandidates(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load candidates");
    }
  };

  // FETCH REGISTERED VOTERS
  const fetchVoters = async () => {
    try {
      setLoadingVoters(true);
      const res = await axios.get(`${API_BASE_URL}/api/users/all`, {
        headers: { Authorization: token }
      });
      setVoters(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load registered voters");
    } finally {
      setLoadingVoters(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
    fetchVoters();
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // SAVE ELECTION SETTINGS
  const saveSettings = async (e) => {
    e.preventDefault();
    if (!elTitle.trim()) {
      toast.error("Election Title is required");
      return;
    }

    try {
      setSavingSettings(true);
      const finalStart = startDate && startTime ? `${startDate}T${startTime}:00` : undefined;
      const finalEnd = endDate && endTime ? `${endDate}T${endTime}:00` : undefined;

      await axios.post(
        `${API_BASE_URL}/api/candidates/election-settings`,
        {
          title: elTitle,
          description: elDescription,
          startDate: finalStart,
          endDate: finalEnd
        },
        {
          headers: { Authorization: token }
        }
      );
      toast.success("Election schedule updated!");
      fetchSettings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save settings");
    } finally {
      setSavingSettings(false);
    }
  };

  // ADD CANDIDATE
  const addCandidate = async (e) => {
    e.preventDefault();

    if (!name.trim() || !party.trim()) {
      toast.error("Candidate name and party are required");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/candidates/add`,
        { 
          name, 
          party, 
          age: age ? Number(age) : undefined, 
          education, 
          experience, 
          manifesto,
          photo,
          motto,
          partySymbol
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      toast.success("Candidate Added Successfully!");
      setName("");
      setParty("");
      setAge("");
      setEducation("");
      setExperience("");
      setManifesto("");
      setPhoto("");
      setMotto("");
      setPartySymbol("");
      fetchCandidates();
      setActiveTab("manage-candidates"); // redirect to list
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding candidate");
    }
  };

  // DELETE CANDIDATE
  const deleteCandidate = async (id) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/candidates/${id}`, {
        headers: { Authorization: token }
      });
      toast.success("Candidate deleted successfully!");
      fetchCandidates();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete candidate");
    }
  };

  // RESET ELECTION
  const resetElection = async () => {
    if (!window.confirm("WARNING: This will reset all votes to 0 and allow all voters to vote again. Proceed?")) return;

    try {
      await axios.post(`${API_BASE_URL}/api/users/reset-election`, {}, {
        headers: { Authorization: token }
      });
      toast.success("Election has been reset successfully!");
      fetchCandidates();
      fetchVoters();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset election");
    }
  };

  // CALCULATE STATS
  const totalVoters = voters.filter(v => v.role === "voter").length;
  const totalAdmins = voters.filter(v => v.role === "admin").length;
  const totalVotesCast = candidates.reduce((sum, c) => sum + (c.votes || 0), 0);
  const turnoutPercent = totalVoters > 0 ? ((totalVotesCast / totalVoters) * 100).toFixed(1) : "0.0";

  // FILTERED VOTERS
  const filteredVoters = voters.filter(v => 
    v.name.toLowerCase().includes(voterSearch.toLowerCase()) ||
    v.email.toLowerCase().includes(voterSearch.toLowerCase()) ||
    v.role.toLowerCase().includes(voterSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white digital-grid">
      <Navbar />

      <div className="px-6 md:px-10 pt-32 pb-20 max-w-7xl mx-auto">
        <h1 className="text-4xl text-center text-aqua mb-8 font-bold drop-shadow-[0_0_15px_#00f5d4] min-h-[50px]">
          {typedHeader}
          <span className="text-aqua animate-pulse">|</span>
        </h1>

        {/* ELECTION STATISTICS BOARD */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="p-4 bg-white/5 border border-aqua/10 rounded-xl text-center">
            <p className="text-xs text-gray-400">Total Voters</p>
            <p className="text-2xl font-bold text-aqua mt-1">{totalVoters}</p>
          </div>
          <div className="p-4 bg-white/5 border border-aqua/10 rounded-xl text-center">
            <p className="text-xs text-gray-400">Total Admins</p>
            <p className="text-2xl font-bold text-aqua mt-1">{totalAdmins}</p>
          </div>
          <div className="p-4 bg-white/5 border border-aqua/10 rounded-xl text-center">
            <p className="text-xs text-gray-400">Votes Cast</p>
            <p className="text-2xl font-bold text-aqua mt-1">{totalVotesCast}</p>
          </div>
          <div className="p-4 bg-white/5 border border-aqua/10 rounded-xl text-center">
            <p className="text-xs text-gray-400">Voter Turnout</p>
            <p className="text-2xl font-bold text-aqua mt-1">{turnoutPercent}%</p>
          </div>
          <div className="p-4 bg-white/5 border border-aqua/10 rounded-xl text-center col-span-2 md:col-span-1">
            <p className="text-xs text-gray-400">Candidates Listed</p>
            <p className="text-2xl font-bold text-aqua mt-1">{candidates.length}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {/* TAB SIDEBAR */}
          <div className="md:col-span-1 space-y-2">
            <button
              onClick={() => setActiveTab("schedule")}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition ${
                activeTab === "schedule"
                  ? "bg-aqua text-black shadow-[0_0_15px_#00f5d4]"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              📅 Election Scheduling
            </button>
            <button
              onClick={() => setActiveTab("add-candidate")}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition ${
                activeTab === "add-candidate"
                  ? "bg-aqua text-black shadow-[0_0_15px_#00f5d4]"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              👤 Add Candidate
            </button>
            <button
              onClick={() => setActiveTab("manage-candidates")}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition ${
                activeTab === "manage-candidates"
                  ? "bg-aqua text-black shadow-[0_0_15px_#00f5d4]"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              👥 Manage Candidates
            </button>
            <button
              onClick={() => setActiveTab("track-voters")}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition ${
                activeTab === "track-voters"
                  ? "bg-aqua text-black shadow-[0_0_15px_#00f5d4]"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              🗳 Track Voters
            </button>
            <button
              onClick={() => setActiveTab("danger-zone")}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition ${
                activeTab === "danger-zone"
                  ? "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                  : "bg-white/5 text-red-400 hover:bg-red-950/20"
              }`}
            >
              ⚠️ Danger Zone
            </button>
          </div>

          {/* TAB CONTENT PANEL */}
          <div className="md:col-span-3">
            {/* SCHEDULER TAB */}
            {activeTab === "schedule" && (
              <form onSubmit={saveSettings} className="p-6 bg-white/5 border border-aqua/20 rounded-xl backdrop-blur-md space-y-4">
                <h2 className="text-2xl font-bold text-aqua mb-2">Configure Election Schedule</h2>
                <p className="text-xs text-gray-400">Set the active time range. Voters can only vote during this live window.</p>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1 font-semibold">Election Title</label>
                    <input
                      className="w-full p-2.5 bg-black border border-aqua/30 rounded-lg text-sm text-white focus:outline-none focus:border-aqua"
                      placeholder="General Election"
                      value={elTitle}
                      onChange={(e) => setElTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1 font-semibold">Description</label>
                    <textarea
                      rows="3"
                      className="w-full p-2.5 bg-black border border-aqua/30 rounded-lg text-sm text-white focus:outline-none focus:border-aqua"
                      placeholder="Enter election details, rules, or instructions..."
                      value={elDescription}
                      onChange={(e) => setElDescription(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1 font-semibold">Start Date</label>
                      <input
                        type="date"
                        className="w-full p-2.5 bg-black border border-aqua/30 rounded-lg text-sm text-white focus:outline-none focus:border-aqua"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1 font-semibold">Start Time</label>
                      <input
                        type="time"
                        className="w-full p-2.5 bg-black border border-aqua/30 rounded-lg text-sm text-white focus:outline-none focus:border-aqua"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1 font-semibold">End Date</label>
                      <input
                        type="date"
                        className="w-full p-2.5 bg-black border border-aqua/30 rounded-lg text-sm text-white focus:outline-none focus:border-aqua"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1 font-semibold">End Time</label>
                      <input
                        type="time"
                        className="w-full p-2.5 bg-black border border-aqua/30 rounded-lg text-sm text-white focus:outline-none focus:border-aqua"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="w-full py-3 bg-aqua text-black font-bold rounded-lg hover:shadow-[0_0_15px_#00f5d4] transition duration-300 cursor-pointer text-sm"
                  >
                    {savingSettings ? "Updating Settings..." : "Save Schedule"}
                  </button>
                </div>
              </form>
            )}

            {/* ADD CANDIDATE TAB */}
            {activeTab === "add-candidate" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-aqua mb-2">Register Contesting Candidate</h2>
                <form onSubmit={addCandidate} className="p-6 bg-white/5 border border-aqua/20 rounded-xl space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1 font-semibold">Candidate Name</label>
                      <input
                        required
                        className="w-full p-3 bg-black border border-aqua/30 rounded-lg text-white focus:outline-none focus:border-aqua text-sm"
                        placeholder="Candidate full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1 font-semibold">Contesting Party</label>
                      <input
                        required
                        className="w-full p-3 bg-black border border-aqua/30 rounded-lg text-white focus:outline-none focus:border-aqua text-sm"
                        placeholder="Party name"
                        value={party}
                        onChange={(e) => setParty(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1 font-semibold">Age</label>
                      <input
                        type="number"
                        className="w-full p-3 bg-black border border-aqua/30 rounded-lg text-white focus:outline-none focus:border-aqua text-sm"
                        placeholder="Candidate age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1 font-semibold">Education</label>
                      <input
                        className="w-full p-3 bg-black border border-aqua/30 rounded-lg text-white focus:outline-none focus:border-aqua text-sm"
                        placeholder="e.g. Master's in Law"
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1 font-semibold">Experience</label>
                    <input
                      className="w-full p-3 bg-black border border-aqua/30 rounded-lg text-white focus:outline-none focus:border-aqua text-sm"
                      placeholder="e.g. 5 Years in Public Administration"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1 font-semibold">Manifesto & Agenda Statement</label>
                    <textarea
                      rows="4"
                      className="w-full p-3 bg-black border border-aqua/30 rounded-lg text-white focus:outline-none focus:border-aqua text-sm leading-relaxed"
                      placeholder="Explain the candidate's core manifesto, goals, and promises."
                      value={manifesto}
                      onChange={(e) => setManifesto(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1 font-semibold">Candidate Motto</label>
                    <input
                      className="w-full p-3 bg-black border border-aqua/30 rounded-lg text-white focus:outline-none focus:border-aqua text-sm"
                      placeholder="e.g. Integrity, Security, Progress"
                      value={motto}
                      onChange={(e) => setMotto(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1 font-semibold">
                      Party Symbol
                    </label>
                    <div className="flex gap-4 mb-3">
                      <button
                        type="button"
                        onClick={() => { setSymbolMode("upload"); setPartySymbol(""); }}
                        className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                          symbolMode === "upload"
                            ? "bg-aqua text-black border-aqua shadow-[0_0_10px_#00f5d4]"
                            : "bg-black text-gray-400 border-white/10 hover:border-aqua/50"
                        }`}
                      >
                        📤 Upload Symbol
                      </button>
                      <button
                        type="button"
                        onClick={() => { setSymbolMode("url"); setPartySymbol(""); }}
                        className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                          symbolMode === "url"
                            ? "bg-aqua text-black border-aqua shadow-[0_0_10px_#00f5d4]"
                            : "bg-black text-gray-400 border-white/10 hover:border-aqua/50"
                        }`}
                      >
                        🔗 Symbol URL
                      </button>
                    </div>

                    {symbolMode === "upload" ? (
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setPartySymbol(reader.result);
                              };
                              reader.readAsDataURL(file);
                            } else {
                              setPartySymbol("");
                            }
                          }}
                          className="w-full p-2.5 bg-black border border-aqua/30 rounded-lg text-white text-xs file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer"
                        />
                      </div>
                    ) : (
                      <input
                        type="text"
                        placeholder="Paste symbol image URL here"
                        value={partySymbol}
                        onChange={(e) => setPartySymbol(e.target.value)}
                        className="w-full p-3 bg-black border border-aqua/30 rounded-lg text-white focus:outline-none focus:border-aqua text-sm animate-fade-in"
                      />
                    )}

                    {partySymbol && (
                      <div className="mt-3 flex items-center gap-3 p-2 bg-white/5 border border-white/10 rounded-lg">
                        <img
                          src={partySymbol}
                          alt="Symbol Preview"
                          className="w-12 h-12 rounded-lg border border-aqua/20 bg-black object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://api.dicebear.com/7.x/bottts/svg?seed=symbol";
                          }}
                        />
                        <span className="text-xs text-gray-400">Symbol Preview</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1 font-semibold">
                      Candidate Photo Source
                    </label>
                    <div className="flex gap-4 mb-3">
                      <button
                        type="button"
                        onClick={() => { setImageMode("upload"); setPhoto(""); }}
                        className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                          imageMode === "upload"
                            ? "bg-aqua text-black border-aqua shadow-[0_0_10px_#00f5d4]"
                            : "bg-black text-gray-400 border-white/10 hover:border-aqua/50"
                        }`}
                      >
                        📤 Upload Image
                      </button>
                      <button
                        type="button"
                        onClick={() => { setImageMode("url"); setPhoto(""); }}
                        className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                          imageMode === "url"
                            ? "bg-aqua text-black border-aqua shadow-[0_0_10px_#00f5d4]"
                            : "bg-black text-gray-400 border-white/10 hover:border-aqua/50"
                        }`}
                      >
                        🔗 Image URL
                      </button>
                    </div>

                    {imageMode === "upload" ? (
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setPhoto(reader.result);
                              };
                              reader.readAsDataURL(file);
                            } else {
                              setPhoto("");
                            }
                          }}
                          className="w-full p-2.5 bg-black border border-aqua/30 rounded-lg text-white text-xs file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer"
                        />
                      </div>
                    ) : (
                      <input
                        type="text"
                        placeholder="Paste image URL here (e.g. https://example.com/photo.jpg)"
                        value={photo}
                        onChange={(e) => setPhoto(e.target.value)}
                        className="w-full p-3 bg-black border border-aqua/30 rounded-lg text-white focus:outline-none focus:border-aqua text-sm animate-fade-in"
                      />
                    )}

                    {photo && (
                      <div className="mt-3 flex items-center gap-3 p-2 bg-white/5 border border-white/10 rounded-lg">
                        <img
                          src={photo}
                          alt="Preview"
                          className="w-12 h-12 rounded-full border border-aqua/20 bg-black object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://api.dicebear.com/7.x/bottts/svg?seed=placeholder";
                          }}
                        />
                        <span className="text-xs text-gray-400">Image Preview</span>
                      </div>
                    )}
                  </div>

                  <button type="submit" className="w-full py-3 bg-aqua text-black font-bold rounded-lg hover:shadow-[0_0_20px_#00f5d4] transition duration-300 cursor-pointer text-sm">
                    Save Candidate
                  </button>
                </form>
              </div>
            )}

            {/* MANAGE CANDIDATES TAB */}
            {activeTab === "manage-candidates" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-aqua">Registered Candidates Management</h2>
                
                {candidates.length === 0 ? (
                  <div className="text-center p-12 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-gray-500 mb-4">No candidates contesting this election yet.</p>
                    <button 
                      onClick={() => setActiveTab("add-candidate")}
                      className="px-4 py-2 bg-aqua text-black rounded-lg text-xs font-bold transition hover:shadow-lg cursor-pointer"
                    >
                      + Register First Candidate
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {candidates.map((c) => (
                      <div
                        key={c._id}
                        className="p-6 bg-white/5 border border-aqua/20 rounded-2xl backdrop-blur-md flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex gap-4 items-center mb-4">
                            <img
                              src={c.photo || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(c.name)}`}
                              alt={c.name}
                              className="w-16 h-16 rounded-full border border-aqua/20 bg-black object-cover"
                            />
                            <div>
                              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                {c.name}
                                {c.motto && <span className="text-[10px] px-2 py-0.5 bg-aqua/10 text-aqua border border-aqua/20 rounded font-mono italic">"{c.motto}"</span>}
                              </h3>
                              <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                                Party: <span className="text-aqua font-semibold">{c.party}</span>
                                {c.partySymbol && (
                                  <img src={c.partySymbol} alt="Symbol" className="w-5 h-5 rounded-full object-cover border border-aqua/30 bg-black inline" />
                                )}
                              </p>
                              {c.age && <p className="text-[10px] text-gray-500 mt-0.5">Age: {c.age} | Ed: {c.education}</p>}
                            </div>
                          </div>
                          
                          <div className="p-3 bg-black/40 border border-white/5 rounded-xl mb-4 text-xs text-gray-400">
                            <span className="font-bold text-aqua block mb-1">Manifesto Summary:</span>
                            <p className="line-clamp-3 leading-relaxed">{c.manifesto || "No manifesto details provided."}</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
                          <span className="text-xs text-aqua font-bold">Total Votes: {c.votes}</span>
                          <button
                            onClick={() => deleteCandidate(c._id)}
                            className="px-4 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white rounded-lg text-xs transition cursor-pointer"
                          >
                            Delete Candidate
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TRACK VOTERS TAB */}
            {activeTab === "track-voters" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-aqua">Registered Voters Tracker</h2>
                    <p className="text-xs text-gray-400 mt-1">Audit registered voter list and ballot statuses.</p>
                  </div>
                  <input 
                    type="text"
                    placeholder="Search name, email or role..."
                    className="px-4 py-2 bg-black border border-aqua/30 rounded-lg text-sm focus:outline-none focus:border-aqua text-white w-full md:w-64"
                    value={voterSearch}
                    onChange={(e) => setVoterSearch(e.target.value)}
                  />
                </div>

                {loadingVoters ? (
                  <p className="text-aqua text-sm font-bold text-center py-10">Syncing voters logs...</p>
                ) : filteredVoters.length === 0 ? (
                  <p className="text-center text-gray-500 py-10 border border-white/5 rounded-xl">No voters matches found in logs.</p>
                ) : (
                  <div className="overflow-x-auto border border-white/5 rounded-xl bg-white/5">
                    <table className="w-full text-left text-sm text-gray-400">
                      <thead className="text-xs uppercase text-aqua border-b border-white/10 bg-[#0c0c0c]">
                        <tr>
                          <th className="px-6 py-4">Name</th>
                          <th className="px-6 py-4">Email</th>
                          <th className="px-6 py-4">Role</th>
                          <th className="px-6 py-4">Ballot Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVoters.map((v) => (
                          <tr key={v._id} className="border-b border-white/5 hover:bg-white/5 transition">
                            <td className="px-6 py-4 text-white font-medium">{v.name}</td>
                            <td className="px-6 py-4">{v.email}</td>
                            <td className="px-6 py-4 capitalize">{v.role}</td>
                            <td className="px-6 py-4">
                              {v.hasVoted ? (
                                <span className="inline-block px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-bold">
                                  Voted
                                </span>
                              ) : (
                                <span className="inline-block px-3 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full text-xs font-bold">
                                  Pending
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* DANGER ZONE TAB */}
            {activeTab === "danger-zone" && (
              <div className="max-w-xl space-y-6">
                <h2 className="text-2xl font-bold text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.2)]">Danger Zone / Election Reset</h2>
                
                <div className="p-6 bg-red-955/20 border border-red-500/30 rounded-2xl space-y-4">
                  <h3 className="text-lg font-bold text-red-400">Reset Voting Statistics</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Executing this action will erase all cast votes for all candidates (resetting their counters to 0) and reset the "hasVoted" flags for all registered users in the database back to "false".
                  </p>
                  <p className="text-xs text-red-500 font-semibold uppercase tracking-wider">
                    ⚠️ WARNING: This action is permanent and cannot be undone!
                  </p>
                  
                  <button 
                    onClick={resetElection}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] cursor-pointer text-sm"
                  >
                    Confirm and Reset Election Database
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;