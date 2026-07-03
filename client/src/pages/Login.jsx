import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState("credentials"); // "credentials" or "otp"
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Backtyping effect setup
  const words = step === "credentials" 
    ? ["Login Portal", "Secure Verification", "Votexa Shield Console"] 
    : ["Verify Code", "Enter Secure OTP", "Unlock Access Ledger"];
  const [wordIdx, setWordIdx] = useState(0);
  const [subIdx, setSubIdx] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [typedHeader, setTypedHeader] = useState("");

  useEffect(() => {
    // Reset typing index on step change
    setWordIdx(0);
    setSubIdx(0);
    setReverse(false);
    setTypedHeader("");
  }, [step]);

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
  }, [subIdx, reverse, wordIdx, step]);

  useEffect(() => {
    setTypedHeader(words[wordIdx].substring(0, subIdx));
  }, [subIdx, wordIdx]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      if (res.data.otpSent) {
        toast.success("Security code sent to your email!");
        setStep("otp");
      } else {
        // Fallback in case backend login doesn't require OTP
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast.success("Login Successful!");
        if (res.data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/users/verify-otp", {
        email,
        otp: otpCode,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Verification Successful!");
      
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    if (value && isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Focus next input box if typed a value
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        const prevInput = document.getElementById(`otp-${index - 1}`);
        if (prevInput) prevInput.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    const data = e.clipboardData.getData("text").trim();
    if (data.length === 6 && /^\d+$/.test(data)) {
      setOtp(data.split(""));
      const lastInput = document.getElementById("otp-5");
      if (lastInput) lastInput.focus();
    }
  };

  const fillDemo = (role) => {
    if (role === "admin") {
      setEmail("admin@votexa.com");
      setPassword("admin123");
    } else {
      setEmail("voter@votexa.com");
      setPassword("voter123");
    }
  };

  const handleBypassOtp = () => {
    setOtp(["9", "9", "9", "9", "9", "9"]);
    toast.success("Bypass code filled");
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white digital-grid">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-12">
        <div className="w-[400px] p-8 bg-white/5 border border-aqua/20 backdrop-blur-md rounded-2xl shadow-[0_0_30px_#00f5d4] transition-all duration-300">
          
          {step === "credentials" ? (
            <>
              <h2 className="text-3xl text-center text-aqua mb-2 font-bold min-h-[40px]">
                {typedHeader}
                <span className="text-aqua animate-pulse">|</span>
              </h2>
              <p className="text-xs text-gray-400 text-center mb-6">Enter your credentials to receive an OTP</p>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Email Address</label>
                  <input
                    required
                    type="email"
                    className="w-full p-3 bg-transparent border border-aqua/30 rounded-lg text-white focus:outline-none focus:border-aqua transition"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Password</label>
                  <input
                    required
                    type="password"
                    className="w-full p-3 bg-transparent border border-aqua/30 rounded-lg text-white focus:outline-none focus:border-aqua transition"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-aqua text-black rounded-lg font-bold hover:shadow-[0_0_20px_#00f5d4] transition duration-300 cursor-pointer disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    "Request Security Code"
                  )}
                </button>
              </form>

              {/* Demo Credentials Section */}
              <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <p className="text-xs text-gray-400 mb-2 font-semibold">Demo Accounts</p>
                <div className="flex gap-2 justify-center">
                  <button 
                    onClick={() => fillDemo("voter")} 
                    className="text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-aqua transition cursor-pointer"
                  >
                    Prefill Voter
                  </button>
                  <button 
                    onClick={() => fillDemo("admin")} 
                    className="text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-aqua transition cursor-pointer"
                  >
                    Prefill Admin
                  </button>
                </div>
              </div>

              <p className="mt-6 text-center text-sm text-gray-400">
                Don't have an account?{" "}
                <Link to="/register" className="text-aqua hover:underline">
                  Register
                </Link>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-3xl text-center text-aqua mb-2 font-bold min-h-[40px]">
                {typedHeader}
                <span className="text-aqua animate-pulse">|</span>
              </h2>
              <p className="text-xs text-gray-400 text-center mb-6">
                Enter the 6-digit OTP code sent to <strong className="text-white">{email}</strong>
              </p>

              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="flex justify-between gap-2" onPaste={handlePaste}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      className="w-12 h-12 text-center text-xl font-bold bg-white/5 border border-aqua/30 rounded-lg text-white focus:outline-none focus:border-aqua focus:shadow-[0_0_10px_#00f5d4] transition"
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, idx)}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                    />
                  ))}
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-aqua text-black rounded-lg font-bold hover:shadow-[0_0_20px_#00f5d4] transition duration-300 cursor-pointer disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    "Verify & Log In"
                  )}
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-2 text-center">
                <button 
                  onClick={handleBypassOtp}
                  className="text-xs py-1.5 px-3 bg-white/10 hover:bg-white/20 rounded text-aqua transition cursor-pointer"
                >
                  Bypass Demo OTP (999999)
                </button>

                <button 
                  onClick={() => {
                    setStep("credentials");
                    setOtp(["", "", "", "", "", ""]);
                  }}
                  className="text-xs text-gray-400 hover:text-white transition mt-2 underline"
                >
                  Back to Login
                </button>
              </div>
            </>
          )}
        </div>
        <div className="w-full max-w-[400px] mt-6">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Login;