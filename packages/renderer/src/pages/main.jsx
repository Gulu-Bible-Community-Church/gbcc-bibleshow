import React from 'react';

function MainScreen() {
  const items = [
    { id: 1, title: 'Item 1', description: 'Description for item 1' },
    { id: 2, title: 'Item 2', description: 'Description for item 2' },
    { id: 3, title: 'Item 3', description: 'Description for item 3' },
  ];

  const handleItemClick = async (item) => {
    try {
      console.log('MainScreen: Handling item click:', item);
      if (!window.electronAPI) {
        console.error('MainScreen: electronAPI is undefined');
        return;
      }
      console.log('MainScreen: Attempting to open secondary window');
      console.log('MainScreen: Sending data to secondary window');
      await window.electronAPI.sendToSecondary(item);
    } catch (error) {
      console.error('MainScreen: Error handling item click:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Main Screen</h1>
      <div className="grid gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
            onClick={() => handleItemClick(item)}
          >
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MainScreen;
