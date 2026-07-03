import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { FaVoteYea, FaArrowLeft } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userJson = localStorage.getItem("user");
  
  let user = null;
  try {
    user = userJson ? JSON.parse(userJson) : null;
  } catch (e) {
    console.error("Error parsing user info:", e);
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center px-6 md:px-10 py-5 backdrop-blur-md bg-white/5 fixed w-full z-50 border-b border-aqua/20">
      
      {/* Brand logo & back button */}
      <div className="flex items-center gap-4">
        {location.pathname !== "/" && (
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-aqua transition cursor-pointer border border-white/10 hover:border-aqua/30 rounded-lg px-3 py-1.5 bg-white/5 shadow-md"
            title="Go Back"
          >
            <FaArrowLeft className="text-xs" /> Back
          </button>
        )}
        
        <Link to="/" className="text-xl md:text-2xl font-bold text-aqua drop-shadow-[0_0_10px_#00f5d4] flex items-center gap-2">
          <FaVoteYea className="text-lg md:text-2xl text-aqua" />
          <span>Votexa</span>
        </Link>
      </div>

      <div className="flex gap-8 text-sm">
        {token ? (
          user?.role === "admin" ? (
            <>
              <Link to="/" className="hover:text-aqua transition text-gray-400">Home</Link>
              <Link to="/admin" className="hover:text-aqua transition">Admin Panel</Link>
              <Link to="/results" className="hover:text-aqua transition">Live Results</Link>
            </>
          ) : (
            <>
              <Link to="/" className="hover:text-aqua transition text-gray-400">Home</Link>
              <Link to="/dashboard" className="hover:text-aqua transition">Dashboard</Link>
              <Link to="/vote" className="hover:text-aqua transition">Cast Vote</Link>
              <Link to="/results" className="hover:text-aqua transition">Live Results</Link>
            </>
          )
        ) : (
          <>
            <Link to="/" className="hover:text-aqua transition text-gray-400">Home</Link>
            <a href="/#features" className="hover:text-aqua transition">Features</a>
            <a href="/#faq" className="hover:text-aqua transition">FAQ</a>
            <a href="/#contact" className="hover:text-aqua transition">Contact</a>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {token ? (
          <>
            <span className="text-sm text-gray-400 hidden sm:inline">
              Hi, <span className="text-aqua">{user?.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg hover:shadow-lg transition cursor-pointer text-xs md:text-sm font-semibold"
            >
              Logout
            </button>
          </>
        ) : (
          <button 
            onClick={() => navigate("/login")}
            className="px-5 py-2 bg-aqua text-black rounded-lg hover:shadow-[0_0_20px_#00f5d4] transition cursor-pointer text-xs md:text-sm font-semibold"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;