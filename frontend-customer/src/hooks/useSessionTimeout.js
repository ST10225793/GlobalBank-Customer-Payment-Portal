import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contex/AuthContext';

const useSessionTimeout = (timeoutMinutes = 5) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const timeoutMs = timeoutMinutes * 60 * 1000;
  const warningMs = 30 * 1000; // Show warning 30 seconds before logout

  const handleLogout = useCallback(() => {
    console.log('Session timeout - logging out');
    setShowWarning(false);
    logout();
    navigate('/login', { state: { message: 'Session expired due to inactivity' } });
  }, [logout, navigate]);

  useEffect(() => {
    let timeoutId;
    let warningId;
    let countdownInterval;

    const resetTimer = () => {
      console.log('Resetting session timer');
      
      // Clear existing timers
      if (timeoutId) clearTimeout(timeoutId);
      if (warningId) clearTimeout(warningId);
      if (countdownInterval) clearInterval(countdownInterval);
      setShowWarning(false);
      setTimeLeft(0);

      // Set warning timer (show 30 seconds before logout)
      warningId = setTimeout(() => {
        console.log('Showing session warning modal');
        setShowWarning(true);
        setTimeLeft(30); // 30 seconds countdown
        
        // Countdown timer for warning modal
        countdownInterval = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, timeoutMs - warningMs);

      // Set logout timer
      timeoutId = setTimeout(() => {
        console.log('Session expired - auto logout');
        handleLogout();
      }, timeoutMs);
    };

    // Events that reset the timer
    const events = [
      'mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click', 'input'
    ];

    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Start the timer
    resetTimer();

    // Cleanup
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      if (timeoutId) clearTimeout(timeoutId);
      if (warningId) clearTimeout(warningId);
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [timeoutMs, handleLogout]);

  return { showWarning, setShowWarning, timeLeft };
};

export default useSessionTimeout;