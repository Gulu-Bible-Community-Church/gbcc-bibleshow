import React, { useState, useCallback } from 'react';

const ScreenToggle = () => {
  const [isScreenActive, setIsScreenActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggleScreen = useCallback(async () => {
    if (loading) return;

    try {
      setLoading(true);
      
      if (!window.electronAPI) {
        alert('Unable to connect to system components. Please restart the application.');
        return;
      }

      if (isScreenActive) {
        const success = await window.electronAPI.closeSecondaryWindow();
        if (success) {
          setIsScreenActive(false);
        }
      } else {
        await window.electronAPI.openSecondaryWindow();
        setIsScreenActive(true);
      }
    } catch (error) {
      console.error('Error toggling secondary screen:', error);
      alert('Failed to toggle the secondary screen. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [loading, isScreenActive]);

  return (
    <div className="screen-toggle-container">
      <button 
        className={`toggle-button ${isScreenActive ? 'active' : ''} ${loading ? 'loading' : ''}`}
        onClick={handleToggleScreen}
        disabled={loading}
      >
        <span className="button-icon">
          {loading ? (
            <div className="loading-spinner" />
          ) : (
            <svg 
              viewBox="0 0 24 24" 
              width="24" 
              height="24" 
              stroke="currentColor" 
              strokeWidth="2" 
              fill="none"
            >
              {isScreenActive ? (
                <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              ) : (
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              )}
            </svg>
          )}
        </span>
        <span className="button-text">
          {loading ? 'Processing...' : (isScreenActive ? 'Close Screen' : 'Show Screen')}
        </span>
      </button>
    </div>
  );
};

export default ScreenToggle;