
import { useState, useEffect } from "react";

export function TimeDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return {
      time: date.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      date: date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short', 
        day: '2-digit'
      }).toUpperCase()
    };
  };

  const { time, date } = formatTime(currentTime);

  return (
    <div className="cyberpunk-clock">
      <div className="clock-container">
        <div className="time-display">
          {time.split('').map((char, index) => (
            <span 
              key={index} 
              className={char === ':' ? 'separator' : 'digit'}
            >
              {char}
            </span>
          ))}
        </div>
        <div className="date-display">{date}</div>
        <div className="glow-effect"></div>
      </div>
      
      <style jsx>{`
        .cyberpunk-clock {
          font-family: 'Courier New', monospace;
          user-select: none;
        }

        .clock-container {
          position: relative;
          background: linear-gradient(135deg, 
            rgba(51, 255, 204, 0.1) 0%, 
            rgba(255, 51, 153, 0.1) 100%);
          border: 1px solid hsl(var(--accent));
          border-radius: 8px;
          padding: 12px 16px;
          backdrop-filter: blur(10px);
          box-shadow: 
            0 0 20px rgba(51, 255, 204, 0.3),
            inset 0 0 20px rgba(255, 51, 153, 0.1);
          overflow: hidden;
        }

        .time-display {
          font-size: 18px;
          font-weight: bold;
          color: hsl(var(--accent));
          text-shadow: 
            0 0 5px currentColor,
            0 0 10px currentColor,
            0 0 15px currentColor;
          letter-spacing: 2px;
          margin-bottom: 4px;
        }

        .digit {
          display: inline-block;
          animation: flicker 3s infinite alternate;
        }

        .separator {
          display: inline-block;
          animation: pulse 1s infinite;
          color: hsl(var(--primary));
        }

        .date-display {
          font-size: 10px;
          color: hsl(var(--primary));
          text-shadow: 0 0 3px currentColor;
          letter-spacing: 1px;
          text-align: center;
        }

        .glow-effect {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, 
            transparent, 
            rgba(51, 255, 204, 0.1), 
            transparent, 
            rgba(255, 51, 153, 0.1), 
            transparent);
          border-radius: 8px;
          z-index: -1;
          animation: rotate 4s linear infinite;
        }

        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .clock-container:hover {
          transform: scale(1.05);
          transition: transform 0.3s ease;
          box-shadow: 
            0 0 30px rgba(51, 255, 204, 0.5),
            inset 0 0 30px rgba(255, 51, 153, 0.2);
        }

        .clock-container:hover .time-display {
          text-shadow: 
            0 0 8px currentColor,
            0 0 15px currentColor,
            0 0 25px currentColor;
        }
      `}</style>
    </div>
  );
}
