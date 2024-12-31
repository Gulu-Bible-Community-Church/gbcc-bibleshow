import React from 'react'
import '../../assets/css/main.css'
import { FaDisplay } from 'react-icons/fa6'
import { FaBookOpen } from 'react-icons/fa'

const MainContent = ({loading, isSecondaryScreenActive, handleScreenToggle, selectedVerse, selectedBook, selectedChapter, selectedVersion, verses, handleVerseDisplay}) => {
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
                  {verses.map((verse, index) => (
                    <div key={index} className="verse-item" onClick={() => handleVerseDisplay(verse, index)}>
                      <div className="verse-header">
                        <span>
                          {selectedBook} {selectedChapter}:{index + 1} ({selectedVersion})
                        </span>
                        <button
                          className="show-verse"
                          onClick={() => handleVerseDisplay(verse, index)}
                        >
                          <FaBookOpen />
                        </button>
                      </div>
                      <p>{verse}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
  )
}

export default MainContent