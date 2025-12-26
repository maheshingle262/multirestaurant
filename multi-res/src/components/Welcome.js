import './Welcome.css';

function Welcome({ setActivePanel }) {
  return (
    <div className="welcome-section">
      <div className="overlay">
        
        {/* 🔥 Main Project Title */}
        <h1 className="brand-name">
          Welcome to <span>Multi Restaurant Platform</span>
        </h1>

        {/* 🔥 Tagline */}
        <p className="main-line">
          Explore Hotels • Order Food • Discover Taste
        </p>

        {/* ✨ Sub Description */}
        <p className="sub-line">
          A smart, modern platform to browse restaurants, explore menus, and enjoy seamless ordering.
        </p>

        {/* 🔘 Center Button Only */}
        <div className="single-button-row">
          <button 
            className="explore-btn secondary center-btn"
            onClick={() => setActivePanel("hotels")}
          >
            Browse Hotels
          </button>
        </div>

      </div>
    </div>
  );
}

export default Welcome;













/*import './Welcome.css';

function Welcome({ setActivePanel }) {
  return (
    <div className="welcome-container">
      {/* 🔽 Animated Floating Button /}
      <button
        onClick={() => setActivePanel('hotels')}
        className="visit-hotels-btn"
      >
        Visit More Hotels
      </button>

      <div className="welcome-section">
        <div className="overlay">
          <h1 className="brand-name animate-fade">Sneha Kitchen</h1>
          <p className="main-line animate-slide">
            Welcome to Sneha Kitchen – Where Every Meal is a Celebration of Authentic Flavors
          </p>
          <p className="sub-line animate-slide-delay">
            Experience the perfect harmony of tradition and innovation in every dish we serve
          </p>

          <div className="button-row">
            <button
              className="explore-btn"
              onClick={() => setActivePanel('menu')}
            >
              Show Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;*/
























