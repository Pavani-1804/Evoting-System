import { useState } from "react";
import toast from "react-hot-toast";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you shortly.");
      setForm({ name: "", email: "", message: "" });
      setSending(false);
    }, 1200);
  };

  return (
    <section id="contact" className="px-6 md:px-20 py-24 relative z-10">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-extrabold text-center text-aqua mb-4 drop-shadow-[0_0_15px_rgba(0,245,212,0.2)]">
          Get in Touch
        </h2>
        <p className="text-center text-gray-400 mb-12 text-sm md:text-base">
          Have questions or need security deployment assistance? Send us a message.
        </p>

        <form 
          onSubmit={handleSubmit}
          className="glass-card p-8 md:p-10 rounded-3xl space-y-6 shadow-[0_0_50px_rgba(0,245,212,0.05)]"
        >
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-mono uppercase">Full Name</label>
            <input 
              required
              className="w-full p-4 bg-black/40 border border-aqua/20 rounded-xl text-white focus:outline-none focus:border-aqua focus:shadow-[0_0_15px_rgba(0,245,212,0.2)] transition duration-300" 
              placeholder="Your Name" 
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-mono uppercase">Email Address</label>
            <input 
              required
              type="email"
              className="w-full p-4 bg-black/40 border border-aqua/20 rounded-xl text-white focus:outline-none focus:border-aqua focus:shadow-[0_0_15px_rgba(0,245,212,0.2)] transition duration-300" 
              placeholder="you@example.com" 
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-mono uppercase">Message Details</label>
            <textarea 
              required
              rows={4}
              className="w-full p-4 bg-black/40 border border-aqua/20 rounded-xl text-white focus:outline-none focus:border-aqua focus:shadow-[0_0_15px_rgba(0,245,212,0.2)] transition duration-300 resize-none" 
              placeholder="Tell us what you need help with..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            ></textarea>
          </div>

          <button 
            type="submit"
            disabled={sending}
            className="w-full py-4 bg-aqua text-black rounded-xl font-bold hover:shadow-[0_0_25px_#00f5d4] transition duration-300 flex items-center justify-center cursor-pointer disabled:opacity-50"
          >
            {sending ? (
              <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Send Message"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;