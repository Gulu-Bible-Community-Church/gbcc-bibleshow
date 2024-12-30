import React, { useEffect, useState } from 'react';

function SecondaryScreen() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    const handleDisplayContent = (data) => {
      console.log('SecondaryScreen: Received content:', data);
      setContent(data);
    };

    if (window.electronAPI) {
      console.log('SecondaryScreen: Setting up content listener');
      window.electronAPI.onDisplayContent(handleDisplayContent);
    }

    return () => {
      if (window.electronAPI) {
        console.log('SecondaryScreen: Removing content listener');
        window.electronAPI.removeDisplayContentListener();
      }
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Secondary Screen</h1>
      {content ? (
        <div className="p-4 border rounded-lg">
          <h2 className="text-lg font-semibold">{content.title}</h2>
          <p className="text-gray-600">{content.description}</p>
        </div>
      ) : (
        <p>No content to display</p>
      )}
    </div>
  );
}

export default SecondaryScreen;
