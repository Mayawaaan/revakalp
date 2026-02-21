// import { useNavigate } from "react-router-dom";
import { useState } from "react";
import NewsletterBox from "../../components/homepage/NewsletterBox";

export default function Contact() {
  // const navigate = useNavigate();

  // Contact form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // connect API here
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section className="bg-[#fff6f8]">

      {/* ================= HERO ================= */}
      <div className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <img
          src="./contact.png"
          className="absolute inset-0 w-full h-full object-cover scale-105 bg-black/30"
          alt="Revakalp Boutique"
        />
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative text-center text-white max-w-3xl px-6">
          <h1 className="text-5xl md:text-6xl font-serif mb-6">
            Let Us Weave Your <span className="text-pink-600">Experience</span>
          </h1>
          <p className="text-lg text-white/90 leading-relaxed mb-4">
            Every <span className="text-pink-600">Revakalp</span> creation reflects the essence of Indian craftsmanship and thoughtful design.
Our team is here to ensure your journey is as <br /> beautiful as the story you choose to wear.
          </p>
        </div>
      </div>

      {/* ================= FLOATING CARDS ================= */}
      <div className="-mt-32 relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Visit */}
        <div className="bg-white rounded-3xl shadow-xl p-10 border border-pink-100 hover:shadow-2xl transition">
          <h3 className="text-2xl font-serif text-pink-900 mb-4">
            Visit Our Boutique
          </h3>
          <p className="text-pink-700 leading-relaxed">
            231-231, Shop No.2<br />
            Dhanwantri Nagar, Rajendra Nagar<br />
            Indore, Madhya Pradesh – 452012
          </p>
          <p className="mt-4 text-pink-600">
            Mon – Sat | 10:30 AM – 8:30 PM
          </p>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-3xl shadow-xl p-10 border border-pink-100 hover:shadow-2xl transition">
          <h3 className="text-2xl font-serif text-pink-900 mb-4">
            Talk to Us
          </h3>
          <p className="text-pink-700">Phone: +91 91096-76562</p>
          <p className="text-pink-700 mt-2">Email: contact@revakalp.com</p>
          <p className="mt-4 text-pink-600">
            Our stylists reply within 24 hours.
          </p>
        </div>

        {/* Careers */}
        <div className="bg-gradient-to-br from-[#c9487c] to-[#9c2756] text-white rounded-3xl shadow-xl p-10 hover:scale-[1.02] transition">
          <h3 className="text-2xl font-serif mb-4">
            Join Revakalp
          </h3>
          <p className="text-white/90 leading-relaxed mb-6">
            Help us preserve India’s textile legacy while shaping a modern fashion brand.
          </p>
          <p>
            Explore exciting career opportunities with us.
          </p>
          {/* <button
            onClick={() => navigate("/explore-jobs")}
            className="bg-white text-pink-700 px-8 py-3 rounded-full font-medium shadow hover:scale-105 transition"
          >
            Explore Careers
          </button> */}
        </div>

      </div>

      {/* ================= CONCIERGE CONTACT FORM ================= */}
      <div className="max-w-6xl mx-auto px-6 py-18 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Text */}
        <div>
          <h2 className="text-4xl font-serif text-pink-900 mb-6">
            Speak With Our Concierge
          </h2>
          <p className="text-pink-700 text-lg leading-relaxed max-w-xl">
            Whether you need styling advice, order assistance, or bespoke recommendations,
            our team is happy to assist you personally.
          </p>

          <ul className="mt-8 space-y-4 text-pink-600">
            <li>• Personal styling guidance</li>
            <li>• Order & delivery support</li>
            <li>• Wedding & festive consultations</li>
          </ul>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/70 backdrop-blur-xl rounded-3xl p-10 shadow-xl border border-pink-200"
        >
          <div className="space-y-6">

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full px-6 py-4 rounded-full border border-pink-300 focus:ring-2 focus:ring-pink-500 outline-none text-pink-800"
              required
            />

            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full px-6 py-4 rounded-full border border-pink-300 focus:ring-2 focus:ring-pink-500 outline-none text-pink-800"
              required
            />

            <textarea
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              placeholder="How can we assist you?"
              className="w-full px-6 py-4 rounded-2xl border border-pink-300 focus:ring-2 focus:ring-pink-500 outline-none text-pink-800 resize-none"
              required
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#c9487c] to-[#9c2756] text-white py-4 rounded-full font-medium shadow-lg hover:scale-[1.02] transition"
            >
              Send Message
            </button>

          </div>
        </form>

      </div>

      {/* ================= STORY ================= */}
      <div className="max-w-5xl mx-auto px-6 py-18 text-center">
        <h2 className="text-4xl font-serif text-pink-900 mb-6">
          A Brand Built on Craft, Care & Culture
        </h2>
        <p className="text-pink-700 leading-relaxed text-lg">
          At Revakalp, we do not simply sell garments.
          We curate stories woven by master artisans across India.
          Every customer becomes a part of this living heritage —
          and we treat every interaction with the same respect as the craft itself.
        </p>
      </div>

      <NewsletterBox />
    </section>
  );
}
