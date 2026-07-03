import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/feedback`);
        setFeedbacks(res.data);
      } catch (err) {
        console.error("Failed to load feedbacks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-aqua font-mono text-xs">
        Syncing voter reviews...
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return null;
  }

  return (
    <section className="px-6 md:px-20 py-24 relative z-10 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-extrabold text-center text-aqua mb-4 drop-shadow-[0_0_15px_rgba(0,245,212,0.2)]">
          Voter Feedback & Reviews
        </h2>
        <p className="text-center text-gray-400 mb-16 text-sm md:text-base">
          Read genuine reviews from voters detailing their security and accessibility experiences.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {feedbacks.map((f) => (
            <div
              key={f._id}
              className="glass-card p-6 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 text-aqua mb-4">
                  {Array.from({ length: f.rating }).map((_, i) => (
                    <span key={i} className="drop-shadow-[0_0_4px_#00f5d4]">★</span>
                  ))}
                  {Array.from({ length: 5 - f.rating }).map((_, i) => (
                    <span key={i} className="text-gray-700">★</span>
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed italic">
                  "{f.message}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500 font-mono">
                <span className="text-white font-semibold">{f.name}</span>
                <span>{new Date(f.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeedbackList;
