// File: About.js
import { motion } from "framer-motion";
import "./About.css";

function About() {
  return (
    <div className="about-wrapper">
      <motion.div
        className="about-card"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          Multi Restaurant Platform
        </motion.h1>

        <p className="about-subtitle">
          One platform. Multiple restaurants. Endless choices.
        </p>

        <motion.p
          className="about-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          We bring together multiple restaurants on a single digital platform,
          enabling customers to discover, explore, and order from their favorite
          hotels with ease. From local food joints to popular dining spots —
          everything lives here.
        </motion.p>

        <motion.div
          className="features-grid"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } }
          }}
        >
          {[
            "🏨 Multiple Restaurants",
            "📍 Location Based Discovery",
            "🍽️ Rich Menu Variety",
            "🛒 Smooth Ordering Flow",
            "📦 Smart Order Tracking"
          ].map((item, i) => (
            <motion.div
              key={i}
              className="feature-box"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              {item}
            </motion.div>
          ))}
        </motion.div>

        <div className="about-quote">
          “Building a smarter food ordering ecosystem”
        </div>

        <div className="about-footer">
          Created by <span>Fidelion Tech</span>
        </div>
      </motion.div>
    </div>
  );
}

export default About;











/*// File: About.js
import { motion } from 'framer-motion';
import './About.css';

function About({ setActivePanel }) {
  return (
    <motion.div
      className="about-panel"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1>🍛 Welcome to Sneha Kitchen</h1>

      <p>
        At <strong>Sneha Kitchen</strong>, we believe in bringing the <span className="highlight">flavors of home</span> to your plate.
        Every meal is prepared with care, using <strong>fresh ingredients</strong> and <strong>traditional recipes</strong> passed down through generations. ❤️
      </p>

      <p>
        Whether you're craving a comforting thali, a spicy pulao, or a soft paratha — <span className="highlight">we serve it all</span> with love!
      </p>

      <div className="quote">✨ Serving tradition, one plate at a time ✨</div>
    </motion.div>
  );
}

export default About;*/











