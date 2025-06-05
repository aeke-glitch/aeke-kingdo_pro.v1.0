import { useState, useEffect } from "react";

export function TimeDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-sm text-gray-600 dark:text-gray-400">
      {currentTime.toLocaleString()}
    </div>
  );
}
