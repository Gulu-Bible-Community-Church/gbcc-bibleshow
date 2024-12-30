import React, { useState, useCallback } from 'react';
import { FaBible, FaSearch, FaCog, FaPlay, FaChevronDown, FaBookOpen, FaEye } from 'react-icons/fa';
import bibleData from '../data/bibles/bible.json'; // Import the bible.json data
import '../assets/css/main.css';

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

const MainScreen = () => {
  const [selectedVersion, setSelectedVersion] = useState('NIV');
  const [selectedBook, setSelectedBook] = useState('Mark');
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showVersions, setShowVersions] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState(null); // State to track the selected verse

  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'error'
  });

  const [isSecondaryScreenActive, setIsSecondaryScreenActive] = useState(false);
  const [loading, setLoading] = useState(false);


  const versions = bibleData.versions;

  // Get books for the selected version
  const selectedVersionData = versions.find(version => version.name === selectedVersion);
  const books = selectedVersionData ? selectedVersionData.books : [];

  // Get verses for the selected book and chapter
  const selectedBookData = books.find(book => book.name === selectedBook);
  const chapters = selectedBookData ? selectedBookData.chapters : [];
  const selectedChapterData = chapters.find(chapter => chapter.number === selectedChapter);
  const verses = selectedChapterData ? selectedChapterData.verses : [];

  const [displayVerse, setDisplayVerse] = useState({
    book: '',
    chapter: 1,
    verseNumber: 1,
    text: '',
    version: ''
  });

  // Filter verses based on search term
  const filteredVerses = verses.filter(verse =>
    verse.toLowerCase().includes(searchTerm.toLowerCase())
  );


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

  const handleVerseDisplay = useCallback(async (verse, index) => {
    try {
      if (!checkElectronAPI()) return;

      if (!isSecondaryScreenActive) {
        showModal('Error', 'Please turn on the secondary screen first.');
        return;
      }

      const verseData = {
        book: selectedBook,
        chapter: selectedChapter,
        verseNumber: index + 1,
        text: verse,
        version: selectedVersion
      };

      setDisplayVerse(verseData);
      setSelectedVerse(verse);

      const formattedVerse = {
        title: `${verseData.book} ${verseData.chapter}:${verseData.verseNumber} (${verseData.version})`,
        content: verseData.text
      };

      const success = await window.electronAPI.sendToSecondary(formattedVerse);

      if (!success) {
        showModal('Display Error', 'No external display detected.');
      }
    } catch (error) {
      console.error('MainScreen: Error handling verse display:', error);
      showModal('Error', 'Failed to display verse.');
    }
  }, [checkElectronAPI, showModal, isSecondaryScreenActive, selectedBook, selectedChapter, selectedVersion]);




  return (
    <div className="container">
      <div className="sidebar">
        <div className="version-selector">
          <label>Bible Version</label>
          <div
            className="version-button"
            onClick={() => setShowVersions(!showVersions)}
          >
            <span>{selectedVersion}</span>
            <FaChevronDown className="ml-auto w-4 h-4" />
          </div>
          {showVersions && (
            <div className="version-dropdown">
              {versions.map(version => (
                <div
                  key={version.name}
                  className="version-item"
                  onClick={() => {
                    setSelectedVersion(version.name);
                    setShowVersions(false);
                  }}
                >
                  {version.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="books-section">
          <label>Books</label>
          <div className="book-list">
            {books.map(book => (
              <div
                key={book.name}
                className={`book-item ${selectedBook === book.name ? 'selected' : ''}`}
                onClick={() => setSelectedBook(book.name)}
              >
                <FaBible className="w-4 h-4 inline mr-2" />
                {book.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="browser">
          <div className="browser-header">
            <h2>Browser</h2>
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
          </div>
          <div className="monitor">
            <div className="monitor-header">
              <h2>Monitor</h2>
              <div className="monitor-controls">
                <button className="play-button">
                  <FaPlay className="w-4 h-4" />
                </button>
                <button className="settings-button">
                  <FaCog className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="monitor-content">
              <p className="monitor-text">
                {selectedVerse ? selectedVerse : "No verse selected."}
              </p>
            </div>
          </div>
          <div className="browser-content">
            {filteredVerses.map((verse, index) => (
              <div key={index} className="verse-item">
                <div className="verse-header">
                  <span>{selectedBook} {selectedChapter}:{index + 1} ({selectedVersion})</span>
                  <button
                    className="show-verse"
                    onClick={() => handleVerseDisplay(verse, index)}
                  >
                    <FaBookOpen className="w-4 h-4" />
                  </button>
                </div>
                <p>{verse}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="controls">
        <div className="search-container">
          <label>Search</label>
          <div className="search-box">
            <FaSearch className="w-4 h-4 mr-2" />
            <input
              type="text"
              placeholder="Search verses..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainScreen;
