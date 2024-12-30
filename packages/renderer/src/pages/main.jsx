import React, { useState } from 'react';


const MainScreen = () => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'error'
  });

  const items = [
    { id: 1, title: 'Item 1', description: 'Description for item 1' },
    { id: 2, title: 'Item 2', description: 'Description for item 2' },
    { id: 3, title: 'Item 3', description: 'Description for item 3' },
  ];

  const showModal = (title, message, type = 'error') => {
    setModalState({ isOpen: true, title, message, type });
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const handleItemClick = async (item) => {
    try {
      console.log('MainScreen: Handling item click:', item);
      
      if (!window.electronAPI) {
        showModal('System Error', 'Unable to connect to system components. Please restart the application.');
        return;
      }

      console.log('MainScreen: Attempting to open secondary window');
      const success = await window.electronAPI.sendToSecondary(item);
      
      if (!success) {
        showModal('Display Error', 'No external display detected. Please connect a second monitor and try again.');
      } else {
        showModal('Success', 'Content sent to secondary display successfully!', 'success');
      }
    } catch (error) {
      console.error('MainScreen: Error handling item click:', error);
      showModal('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="container">
      <h1 className="title">Main Screen</h1>
      <div className="grid">
        {items.map((item) => (
          <div
            key={item.id}
            className="item"
            onClick={() => handleItemClick(item)}
          >
            <h2 className="item-title">{item.title}</h2>
            <p className="item-description">{item.description}</p>
          </div>
        ))}
      </div>

      {modalState.isOpen && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className={`modal ${modalState.type}`}>
            <div className="modal-header">
              {modalState.type === 'error' ? (
                <svg className="modal-icon error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12" y2="16" />
                </svg>
              ) : (
                <svg className="modal-icon success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              )}
              <h2 className="modal-title">{modalState.title}</h2>
            </div>
            <div className="modal-body">
              <p>{modalState.message}</p>
            </div>
            <button className="modal-close" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainScreen;