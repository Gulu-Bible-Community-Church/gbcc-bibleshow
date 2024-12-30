import React, { useEffect, useState } from 'react';
import '../assets/css/secondary.css';

function SecondaryScreen() {
  const [content, setContent] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    const handleDisplayContent = (data) => {
      console.log('SecondaryScreen: Received content:', data);
      setContent(data);
    };

    if (window.electronAPI) {
      window.electronAPI.onDisplayContent(handleDisplayContent);
    }

    return () => {
      if (window.electronAPI) {
        window.electronAPI.removeDisplayContentListener();
      }
    };
  }, []);

  return (
    <div className="secondary-screen">
      {content.title ? (
        <div className="content">
          <h2>{content.title}</h2>
          <p>{content.content}</p>
        </div>
      ) : (
        <div className="waiting">Waiting for content...</div>
      )}
    </div>
  );
}

export default SecondaryScreen;
