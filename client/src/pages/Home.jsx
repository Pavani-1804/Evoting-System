import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import FAQ from "../components/FAQ";
import FeedbackList from "../components/FeedbackList";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="digital-grid min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
      <Features />
      <FAQ />
      <FeedbackList />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;