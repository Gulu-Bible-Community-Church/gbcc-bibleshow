import React, { useState, useCallback } from 'react';

// Separate Modal Component
const Modal = ({ isOpen, title, message, type, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className={`modal-header ${type}`}>
          {type === 'error' ? (
            <svg className="modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12" y2="16" />
            </svg>
          ) : (
            <svg className="modal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          )}
          <h2 className="modal-title">{title}</h2>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <button className="modal-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

// Item Card Component
const ItemCard = ({ item, onClick }) => (
  <div 
    className="item-card"
    onClick={() => onClick(item)}
    tabIndex={0}
    role="button"
    aria-label={`Select ${item.title}`}
    onKeyPress={(e) => e.key === 'Enter' && onClick(item)}
  >
    <h2 className="item-title">{item.title}</h2>
    <p className="item-description">{item.description}</p>
  </div>
);

// Main Component
const MainScreen = () => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'error'
  });

  const [isSecondaryScreenActive, setIsSecondaryScreenActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const items = [
    { id: 1, title: 'Item 1', description: 'Description for item 1' },
    { id: 2, title: 'Item 2', description: 'Description for item 2' },
    { id: 3, title: 'Item 3', description: 'Description for item 3' }
  ];

  const showModal = useCallback((title, message, type = 'error') => {
    setModalState({ isOpen: true, title, message, type });
  }, []);

  const closeModal = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const checkElectronAPI = useCallback(() => {
    if (!window.electronAPI) {
      showModal('System Error', 'Unable to connect to system components. Please restart the application.');
      return false;
    }
    return true;
  }, [showModal]);

  const handleTurnOnSecondaryScreen = useCallback(async () => {
    if (loading || isSecondaryScreenActive) return;

    try {
      setLoading(true);
      console.log('MainScreen: Attempting to open secondary window');

      if (!checkElectronAPI()) {
        setLoading(false);
        return;
      }

      await window.electronAPI.openSecondaryWindow();
      setIsSecondaryScreenActive(true);
      showModal('Success', 'Secondary screen turned on successfully!', 'success');
    } catch (error) {
      console.error('MainScreen: Error turning on secondary screen:', error);
      showModal('Error', 'Failed to activate the secondary screen. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [loading, isSecondaryScreenActive, checkElectronAPI, showModal]);

  const handleTurnOffSecondaryScreen = useCallback(async () => {
    if (loading || !isSecondaryScreenActive) return;

    try {
      setLoading(true);
      console.log('MainScreen: Attempting to close secondary window');

      if (!window.electronAPI) {
        showModal('System Error', 'Unable to connect to system components. Please restart the application.');
        setLoading(false);
        return;
      }

      const success = await window.electronAPI.closeSecondaryWindow();
      
      if (success) {
        setIsSecondaryScreenActive(false);
        showModal('Success', 'Secondary screen turned off successfully!', 'success');
      } else {
        showModal('Error', 'Secondary screen is not active.');
      }
    } catch (error) {
      console.error('MainScreen: Error turning off secondary screen:', error);
      showModal('Error', 'Failed to deactivate the secondary screen. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [loading, isSecondaryScreenActive, showModal]);

  const handleItemClick = useCallback(async (item) => {
    try {
      console.log('MainScreen: Handling item click:', item);

      if (!checkElectronAPI()) return;

      if (!isSecondaryScreenActive) {
        showModal('Error', 'Please turn on the secondary screen first.');
        return;
      }

      console.log('MainScreen: Sending content to secondary screen');
      const success = await window.electronAPI.sendToSecondary(item);

      if (!success) {
        showModal('Display Error', 'No external display detected. Please connect a second monitor and try again.');
      }
    } catch (error) {
      console.error('MainScreen: Error handling item click:', error);
      showModal('Error', 'An unexpected error occurred. Please try again.');
    }
  }, [checkElectronAPI, showModal, isSecondaryScreenActive]);

  return (
    <div className="container">
      <h1 className="main-title">Main Screen</h1>

      <div className="screen-controls">
        <button
          className={`control-btn ${isSecondaryScreenActive ? 'active' : ''} ${loading ? 'loading' : ''}`}
          onClick={handleTurnOnSecondaryScreen}
          disabled={isSecondaryScreenActive || loading}
        >
          {loading && !isSecondaryScreenActive ? 'Turning On...' : 'Turn On Screen'}
        </button>

        <button
          className={`control-btn off ${isSecondaryScreenActive ? 'active' : ''} ${loading ? 'loading' : ''}`}
          onClick={handleTurnOffSecondaryScreen}
          disabled={!isSecondaryScreenActive || loading}
        >
          {loading && isSecondaryScreenActive ? 'Turning Off...' : 'Turn Off Screen'}
        </button>
      </div>

      <div className="items-grid">
        {items.map(item => (
          <ItemCard key={item.id} item={item} onClick={handleItemClick} />
        ))}
      </div>

      <Modal 
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        onClose={closeModal}
      />

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .main-title {
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 2rem;
          text-align: center;
        }

        .screen-controls {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .control-btn {
          padding: 1rem 2rem;
          font-size: 1.1rem;
          color: white;
          background-color: #2563eb;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 180px;
        }

        .control-btn:hover:not(:disabled) {
          background-color: #1d4ed8;
          transform: translateY(-1px);
        }

        .control-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .control-btn.off {
          background-color: #dc2626;
        }

        .control-btn.off:hover:not(:disabled) {
          background-color: #b91c1c;
        }

        .control-btn.loading {
          position: relative;
          opacity: 0.8;
        }

        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          padding: 1rem;
        }

        .item-card {
          background: white;
          border-radius: 0.5rem;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          opacity: ${isSecondaryScreenActive ? '1' : '0.7'};
          pointer-events: ${isSecondaryScreenActive ? 'auto' : 'none'};
        }

        .item-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .item-title {
          font-size: 1.5rem;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .item-description {
          color: #666;
          line-height: 1.5;
        }

        /* Modal styles remain the same */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 0.5rem;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .modal-header.error {
          color: #dc2626;
        }

        .modal-header.success {
          color: #16a34a;
        }

        .modal-icon {
          width: 24px;
          height: 24px;
        }

        .modal-title {
          font-size: 1.25rem;
          margin: 0;
        }

        .modal-body {
          padding: 1.5rem;
        }

        .modal-close-btn {
          display: block;
          width: calc(100% - 3rem);
          margin: 0 1.5rem 1.5rem;
          padding: 0.75rem;
          background: #e5e7eb;
          border: none;
          border-radius: 0.375rem;
          color: #374151;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .modal-close-btn:hover {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
};

export default MainScreen;