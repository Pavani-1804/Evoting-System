import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { API_BASE_URL } from "../config";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("voter");
  const [adminCode, setAdminCode] = useState("");
  const [photo, setPhoto] = useState("");
  const [imageMode, setImageMode] = useState("upload"); // upload | url
  const navigate = useNavigate();

  // Backtyping effect setup
  const words = ["Register Account", "Join the Ledger", "Decentralized Voting ID"];
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

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_BASE_URL}/api/users/register`, {
        name,
        email,
        password,
        role,
        adminCode: role === "admin" ? adminCode : undefined,
        photo,
      });

      toast.success("Registered Successfully! Please Login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white digital-grid">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-28 pb-12">
        <div className="max-w-md w-full p-6 md:p-8 bg-white/5 border border-aqua/20 backdrop-blur-md rounded-2xl shadow-[0_0_30px_#00f5d4]">
          <h2 className="text-3xl text-center text-aqua mb-6 font-bold min-h-[40px]">
            {typedHeader}
            <span className="text-aqua animate-pulse">|</span>
          </h2>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Full Name</label>
              <input
                required
                className="w-full p-3 bg-transparent border border-aqua/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aqua"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Email Address</label>
              <input
                required
                type="email"
                className="w-full p-3 bg-transparent border border-aqua/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aqua"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Password</label>
              <input
                required
                type="password"
                className="w-full p-3 bg-transparent border border-aqua/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aqua"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Profile Photo (Optional)</label>
              <div className="flex gap-4 mb-2">
                <button
                  type="button"
                  onClick={() => { setImageMode("upload"); setPhoto(""); }}
                  className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                    imageMode === "upload"
                      ? "bg-aqua text-black border-aqua shadow-[0_0_10px_#00f5d4]"
                      : "bg-black text-gray-400 border-white/10 hover:border-aqua/50"
                  }`}
                >
                  📤 Upload File
                </button>
                <button
                  type="button"
                  onClick={() => { setImageMode("url"); setPhoto(""); }}
                  className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                    imageMode === "url"
                      ? "bg-aqua text-black border-aqua shadow-[0_0_10px_#00f5d4]"
                      : "bg-black text-gray-400 border-white/10 hover:border-aqua/50"
                  }`}
                >
                  🔗 Image URL
                </button>
              </div>

              {imageMode === "upload" ? (
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
                  className="w-full p-2.5 bg-black border border-aqua/30 rounded-lg text-white text-xs file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer"
                />
              ) : (
                <input
                  type="text"
                  placeholder="Paste profile image URL here"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                  className="w-full p-2.5 bg-black border border-aqua/30 rounded-lg text-white focus:outline-none focus:border-aqua text-xs"
                />
              )}

              {photo && (
                <div className="mt-2 flex items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-lg">
                  <img
                    src={photo}
                    alt="Profile Preview"
                    className="w-8 h-8 rounded-full border border-aqua/20 bg-black object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://api.dicebear.com/7.x/adventurer/svg?seed=placeholder";
                    }}
                  />
                  <span className="text-[10px] text-gray-400">Preview Loaded</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Register As</label>
              <select
                className="w-full p-3 bg-black border border-aqua/30 rounded-lg text-white focus:outline-none focus:border-aqua"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="voter">Voter</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {role === "admin" && (
              <div>
                <label className="block text-xs text-aqua mb-1">Admin Access Code</label>
                <input
                  required
                  type="password"
                  className="w-full p-3 bg-transparent border border-aqua rounded-lg text-white placeholder-gray-500 focus:outline-none focus:shadow-[0_0_10px_#00f5d4]"
                  placeholder="Enter admin verification key"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                />
              </div>
            )}

            <button className="w-full py-3 bg-aqua text-black rounded-lg font-bold hover:shadow-[0_0_20px_#00f5d4] transition duration-300 cursor-pointer">
              Register
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-aqua hover:underline">
              Login
            </Link>
          </p>
        </div>
        <div className="w-full max-w-[400px] mt-6">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Register;