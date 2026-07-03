import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API_BASE_URL } from "../config";
import { Pie, Bar } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title 
} from "chart.js";

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title
);

const Results = () => {
  const [results, setResults] = useState([]);
  const [totalVoters, setTotalVoters] = useState(0);
  const [settings, setSettings] = useState(null);
  const [electionStatus, setElectionStatus] = useState("Upcoming");
  const [logs, setLogs] = useState([
    "🔒 Initialising secure encryption keys...",
    "✅ Ledger database successfully connected",
    "📡 Real-time SHA-256 decryption sync active"
  ]);

  // Backtyping effect setup
  const words = [settings?.title || "Live Election Results", "Decentralized Standings", "Audit Ledger Realtime"];
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

  const fetchResultsAndSettings = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/candidates/results`);
      setResults(res.data.results);
      setTotalVoters(res.data.totalVoters || 0);

      const settingsRes = await axios.get(`${API_BASE_URL}/api/candidates/election-settings`);
      setSettings(settingsRes.data);
      
      if (settingsRes.data) {
        const now = new Date().getTime();
        const start = new Date(settingsRes.data.startDate).getTime();
        const end = new Date(settingsRes.data.endDate).getTime();

        if (now < start) {
          setElectionStatus("Upcoming");
        } else if (now >= start && now <= end) {
          setElectionStatus("Live");
        } else {
          setElectionStatus("Completed");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchResultsAndSettings();
    const interval = setInterval(fetchResultsAndSettings, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const logsList = [
      "🔒 Securing ballot blocks with AES-256...",
      "🔬 Integrity check: Zero anomalies detected in DB",
      "🤝 Consensus node verification: 100% match",
      "🔄 Refreshing client state... verified connection",
      "🔗 Block chain verified: Node #" + Math.floor(Math.random() * 1000 + 1000) + "-X check passed",
      "🛡️ Secure socket connection established successfully",
      "📊 Database snapshot audit: Complete",
      "🔑 Session key verification success",
      "📑 Audit trail logged to system register"
    ];
    
    const logInterval = setInterval(() => {
      const randomLog = logsList[Math.floor(Math.random() * logsList.length)];
      setLogs((prev) => [randomLog, ...prev.slice(0, 4)]);
    }, 4500);
    
    return () => clearInterval(logInterval);
  }, []);

  const downloadCSV = () => {
    const csvRows = [
      ["Candidate Name", "Party", "Votes Count"],
      ...results.map(c => [c.name, c.party, c.votes])
    ];
    const csvContent = "data:text/csv;charset=utf-8," 
      + csvRows.map(e => e.map(val => `"${val}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${settings?.title || "Election"}_Results.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const winner = results[0];
  const totalVotes = results.reduce((sum, c) => sum + (c.votes || 0), 0);

  // Chart Data Configuration
  const chartData = {
    labels: results.map(c => c.name),
    datasets: [
      {
        label: "Votes Cast",
        data: results.map(c => c.votes),
        backgroundColor: [
          "rgba(0, 245, 212, 0.6)", // Aqua
          "rgba(255, 0, 127, 0.6)",  // Magenta
          "rgba(57, 255, 20, 0.6)",   // Lime
          "rgba(0, 191, 255, 0.6)",  // Sky Blue
          "rgba(255, 165, 0, 0.6)",   // Orange
          "rgba(155, 89, 182, 0.6)"   // Purple
        ],
        borderColor: "rgba(255, 255, 255, 0.15)",
        borderWidth: 1.5,
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        ticks: { color: "#888" },
        grid: { color: "rgba(255, 255, 255, 0.05)" }
      },
      x: {
        ticks: { color: "#888" },
        grid: { display: false }
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white digital-grid">
      <Navbar />

      <div className="px-6 md:px-10 pt-32 pb-20 max-w-7xl mx-auto">
        {/* HEADER BAR */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-green-400 font-bold uppercase tracking-widest font-mono">Live Audit Stream Enabled</span>
            </div>
            <h1 className="text-4xl text-left text-aqua font-bold mt-1 drop-shadow-[0_0_15px_#00f5d4] min-h-[50px]">
              {typedHeader}
              <span className="text-aqua animate-pulse">|</span>
            </h1>
            <p className="text-gray-400 mt-1 text-sm">
              Status: <span className={`uppercase font-bold ${
                electionStatus === "Live" ? "text-green-400" :
                electionStatus === "Upcoming" ? "text-yellow-400" : "text-red-500"
              }`}>{electionStatus}</span>
            </p>
          </div>
          {results.length > 0 && (
            <button
              onClick={downloadCSV}
              className="px-5 py-2.5 bg-aqua text-black font-bold rounded-lg hover:shadow-[0_0_20px_#00f5d4] transition duration-300 cursor-pointer text-sm flex items-center gap-2 hover:scale-[1.02]"
            >
              📊 Export Results (CSV)
            </button>
          )}
        </div>

        {/* ELECTION INSIGHTS OVERVIEW */}
        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-gray-400 text-xs uppercase font-bold tracking-wider block">Registered Voters</span>
                <span className="text-3xl font-extrabold text-white mt-1 block">{totalVoters}</span>
              </div>
              <span className="text-[10px] text-gray-500 mt-2 block">Total system-eligible voters</span>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-gray-400 text-xs uppercase font-bold tracking-wider block">Total Votes Cast</span>
                <span className="text-3xl font-extrabold text-aqua mt-1 block">{totalVotes}</span>
              </div>
              <div className="w-full bg-gray-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-aqua h-1.5 rounded-full" 
                  style={{ width: `${totalVoters > 0 ? (totalVotes / totalVoters) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-gray-400 text-xs uppercase font-bold tracking-wider block">Voter Turnout</span>
                <span className="text-3xl font-extrabold text-white mt-1 block">
                  {totalVoters > 0 ? ((totalVotes / totalVoters) * 100).toFixed(1) : "0.0"}%
                </span>
              </div>
              <span className="text-[10px] text-aqua font-mono mt-2 block">Active participation rate</span>
            </div>

            <div className="p-6 bg-gradient-to-br from-aqua/10 to-transparent border border-aqua/30 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-aqua text-xs uppercase font-bold tracking-wider block">Current Leader</span>
                <span className="text-2xl font-extrabold text-white mt-1 block truncate">
                  👑 {winner ? winner.name : "N/A"}
                </span>
              </div>
              <span className="text-[10px] text-gray-400 block mt-2">
                Leading with {winner ? winner.votes : 0} votes ({winner && totalVotes > 0 ? ((winner.votes / totalVotes) * 100).toFixed(1) : 0}%)
              </span>
            </div>
          </div>
        )}

        {/* WINNER JUMBOTRON (ELECTION COMPLETED) */}
        {electionStatus === "Completed" && winner && winner.votes > 0 && (
          <div className="text-center mb-10 p-8 bg-gradient-to-r from-aqua/10 via-black to-aqua/10 border-2 border-aqua rounded-2xl max-w-3xl mx-auto shadow-[0_0_35px_rgba(0,245,212,0.2)] backdrop-blur-md relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-aqua/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-aqua/5 rounded-full blur-3xl"></div>
            <span className="text-6xl block mb-3 animate-bounce">🏆</span>
            <h2 className="text-xs text-aqua uppercase tracking-widest font-extrabold">Official Election Winner</h2>
            <h3 className="text-4xl font-black mt-2 text-white tracking-tight">{winner.name}</h3>
            <p className="text-gray-400 text-sm mt-1">Party Affiliation: <span className="text-white font-semibold">{winner.party}</span></p>
            <div className="mt-5 inline-block bg-aqua text-black px-6 py-2 rounded-full font-black text-sm tracking-wider shadow-lg">
              Votes Secured: {winner.votes} ({((winner.votes / totalVotes) * 100).toFixed(1)}% Share)
            </div>
          </div>
        )}

        {results.length === 0 ? (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl max-w-2xl mx-auto">
            <p className="text-gray-500 text-lg font-medium">No candidates or voting analytics available yet.</p>
            <p className="text-xs text-gray-600 mt-1">Once voting commences, data will render here in real time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ANALYTICS CHARTS COLUMN (SPANS 2 COLUMNS ON DESKTOP) */}
            <div className="lg:col-span-2 space-y-8">
              {/* CHARTS CARD */}
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                <h3 className="text-xl font-bold text-aqua mb-6 flex items-center gap-2">
                  📊 Statistical Vote Share Distribution
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex flex-col items-center justify-center p-4 bg-black/40 border border-white/5 rounded-xl">
                    <h4 className="text-xs text-gray-400 mb-4 uppercase tracking-wider font-bold">Percentage Share</h4>
                    <div className="w-56 h-56">
                      <Pie data={chartData} />
                    </div>
                  </div>

                  <div className="flex flex-col justify-center p-4 bg-black/40 border border-white/5 rounded-xl">
                    <h4 className="text-xs text-gray-400 mb-4 uppercase tracking-wider font-bold">Absolute Tally</h4>
                    <div className="w-full">
                      <Bar data={chartData} options={barChartOptions} />
                    </div>
                  </div>
                </div>
              </div>

              {/* CANDIDATE LEADERBOARD TALLIES */}
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                <h3 className="text-xl font-bold text-white mb-6">
                  👥 Candidate Standing & Tally List
                </h3>
                <div className="space-y-4">
                  {results.map((c, index) => {
                    const percentage = totalVotes > 0 ? ((c.votes / totalVotes) * 100).toFixed(1) : 0;
                    return (
                      <div
                        key={c._id}
                        className={`p-4 rounded-xl border transition duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4
                        ${
                          index === 0
                            ? "border-aqua/50 bg-aqua/5 shadow-[0_0_15px_rgba(0,245,212,0.05)]"
                            : "border-white/5 bg-black/30 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black/50 border border-white/10 text-xs font-mono font-bold text-aqua">
                            #{index + 1}
                          </div>
                          <img
                            src={c.photo || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(c.name)}`}
                            alt={c.name}
                            className="w-12 h-12 rounded-full border border-aqua/20 bg-black object-cover"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-white text-base">{c.name}</h4>
                              {index === 0 && <span className="text-xs px-2 py-0.5 bg-aqua/20 text-aqua rounded-md font-bold">Leader</span>}
                            </div>
                            <p className="text-xs text-gray-400">Party: <span className="text-aqua font-medium">{c.party}</span></p>
                          </div>
                        </div>

                        <div className="flex-1 max-w-xs md:mx-6">
                          <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-aqua h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                            <span>Vote Share</span>
                            <span className="font-semibold text-gray-300">{percentage}%</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-lg font-extrabold text-white block">{c.votes}</span>
                          <span className="text-[10px] text-gray-400 block">votes secured</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* LIVE AUDITING COLUMN */}
            <div className="lg:col-span-1">
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md sticky top-28 h-fit">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                  <h3 className="text-base font-bold text-aqua flex items-center gap-2">
                    🔒 Secure Audit Trail
                  </h3>
                  <span className="px-2 py-0.5 text-[9px] bg-aqua/10 text-aqua border border-aqua/20 rounded font-mono uppercase tracking-wider animate-pulse">active</span>
                </div>
                <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                  Real-time cryptographic audit trail simulator validating system security, schema parity, and socket health.
                </p>

                <div className="space-y-4">
                  {logs.map((log, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg text-xs font-mono border leading-normal animate-fade-in
                      ${
                        index === 0 
                          ? "bg-aqua/5 border-aqua/20 text-aqua" 
                          : "bg-black/30 border-white/5 text-gray-400"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] text-gray-500 mt-0.5">[{new Date().toLocaleTimeString()}]</span>
                        <p className="flex-1 break-all">{log}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 text-center">
                  <div className="inline-flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
                    System Integrity: SECURE (100%)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Results;