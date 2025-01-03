import React, { useState, useEffect } from 'react';
import { FaDisplay } from 'react-icons/fa6';
import { FaBookOpen } from 'react-icons/fa';
// import { ChevronLeft, ChevronRight } from 'lucide-react';

const MainContent = ({
  loading,
  isSecondaryScreenActive,
  handleScreenToggle,
  selectedVerse,
  selectedBook,
  selectedChapter,
  selectedVersion,
  verses,
  handleVerseDisplay
}) => {
  const [activeVerseIndex, setActiveVerseIndex] = useState(0);

  const handlePreviousVerse = () => {
    if (activeVerseIndex > 0) {
      const newIndex = activeVerseIndex - 1;
      setActiveVerseIndex(newIndex);
      handleVerseDisplay(verses[newIndex], newIndex);
    }
  };

  const handleNextVerse = () => {
    if (activeVerseIndex < verses.length - 1) {
      const newIndex = activeVerseIndex + 1;
      setActiveVerseIndex(newIndex);
      handleVerseDisplay(verses[newIndex], newIndex);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePreviousVerse();
      } else if (e.key === 'ArrowRight') {
        handleNextVerse();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeVerseIndex, verses]);

  // console.log("verses coming in...", verses);

  return (
    <div className="main-content">
      <div className="browser">
        {/* Browser Header */}
        <div className="browser-header">
          <h2>Browser</h2>
          <div className="screen-toggle">
            <label className="switch-label">
              <FaDisplay size={20} />
              External Display
            </label>
            <label className={`switch-container ${loading ? 'loading' : ''}`}>
              <input
                type="checkbox"
                checked={isSecondaryScreenActive}
                onChange={handleScreenToggle}
                disabled={loading}
              />
              <span className="switch-slider"></span>
            </label>
            <span className={`status-indicator ${isSecondaryScreenActive ? 'on' : 'off'}`}>
              {loading ? 'Processing...' : isSecondaryScreenActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {/* Monitor Section */}
        <div className="monitor">
          <div className="monitor-content">

            <p className="monitor-text">
              {selectedVerse ? selectedVerse : "No verse selected."}
            </p>


          </div>
        </div>

        {/* Browser Content */}
        <div className="browser-content">
          {selectedChapter ? (
            <>
              <div className="chapter-header">
                <h3>
                  {selectedBook} Chapter {selectedChapter}
                </h3>
              </div>
              <div className="verses-grid">
                {/* {
                  verses.map((verse) => {
                    console.log(verse)
                    return (
                      <>
                      <p>hello</p>
                      </>
                    )
                  })
                } */}
                {verses.map((verse, index) => {
                  // console.log(verse, index)
                  return (
                  <div
                    key={index}
                    className={`verse-item ${index === activeVerseIndex ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => {
                      setActiveVerseIndex(index);
                      handleVerseDisplay(verse.text, index);
                    }}
                  >
                    <div className="verse-header">
                      <span>
                        {selectedBook} {selectedChapter}:{index + 1} ({selectedVersion})
                      </span>
                      <button
                        className="show-verse"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveVerseIndex(index);
                          handleVerseDisplay(verse.text, index);
                        }}
                      >
                        <FaBookOpen />
                      </button>
                    </div>
                    <p>{verse.text}</p>
                  </div>
                )})}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MainContent;