import { useState, useEffect } from 'react';

const SplashScreen = () => {
  const [dots, setDots] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animated dots
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + 1;
      });
    }, 30);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#fff",
      color: "#333",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      {/* App Logo with Pulse Animation */}
      <div style={{
        fontSize: "48px",
        fontWeight: "700",
        marginBottom: "16px",
        animation: "pulse 2s ease-in-out infinite",
        textShadow: "none"
      }}>
        MyApp
      </div>

      {/* Animated Loading Text */}
      <div style={{
        fontSize: "18px",
        fontWeight: "300",
        marginBottom: "48px",
        minHeight: "27px",
        letterSpacing: "2px"
      }}>
        Loading{dots}
      </div>

      {/* Progress Bar Container */}
      <div style={{
        width: "280px",
        height: "6px",
        background: "rgba(0, 0, 0, 0.05)",
        borderRadius: "10px",
        overflow: "hidden",
        position: "relative"
      }}>
        {/* Progress Bar Fill */}
        <div style={{
          height: "100%",
          width: `${progress}%`,
          background: "linear-gradient(90deg, #333 0%, rgba(51,51,51,0.8) 100%)",
          borderRadius: "10px",
          transition: "width 0.3s ease",
          boxShadow: "none"
        }} />
      </div>

      {/* Percentage Text */}
      <div style={{
        marginTop: "16px",
        fontSize: "14px",
        fontWeight: "500",
        opacity: "0.9"
      }}>
        {progress}%
      </div>

      {/* Floating Circles Animation */}
      <div style={{ position: "absolute", width: "100%", height: "100%", overflow: "hidden", zIndex: 0 }}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: `${60 + i * 20}px`,
              height: `${60 + i * 20}px`,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.05)",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 1;
          }
          50% { 
            transform: scale(1.05);
            opacity: 0.9;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          33% {
            transform: translateY(-20px) translateX(10px);
          }
          66% {
            transform: translateY(10px) translateX(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;