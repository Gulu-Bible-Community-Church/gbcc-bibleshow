import React, { useState, useCallback } from 'react';
import { FaBible, FaSearch, FaCog, FaPlay, FaChevronDown, FaBookOpen, FaEye, FaArrowLeft } from 'react-icons/fa';
import bibleData from '../data/bibles/bible.json';
import '../assets/css/main.css';
import { FaDisplay, } from 'react-icons/fa6';
import Modal from '../utils/Modal';
import SidebarSection from '../components/home/SidebarSection';
import ChapterSection from '../components/home/ChapterSection';
import MainContent from '../components/home/MainContent';



const MainScreen = () => {
  // State management
  const [selectedVersion, setSelectedVersion] = useState('NIV');
  const [selectedBook, setSelectedBook] = useState('Mark');
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showVersions, setShowVersions] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [isSecondaryScreenActive, setIsSecondaryScreenActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'error'
  });

  const [displayVerse, setDisplayVerse] = useState({
    book: '',
    chapter: 1,
    verseNumber: 1,
    text: '',
    version: ''
  });

  // Data management
  const versions = bibleData.versions;
  const selectedVersionData = versions.find(version => version.name === selectedVersion);
  const books = selectedVersionData ? selectedVersionData.books : [];
  const selectedBookData = books.find(book => book.name === selectedBook);
  const chapters = selectedBookData ? selectedBookData.chapters : [];
  const selectedChapterData = selectedChapter ? chapters.find(chapter => chapter.number === selectedChapter) : null;
  const verses = selectedChapterData ? selectedChapterData.verses : [];

  // Modal management
  const showModal = useCallback((title, message, type = 'error') => {
    setModalState({ isOpen: true, title, message, type });
  }, []);

  const closeModal = useCallback(() => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  }, []);

  // System checks
  const checkElectronAPI = useCallback(() => {
    if (!window.electronAPI) {
      showModal('System Error', 'Unable to connect to system components. Please restart the application.');
      return false;
    }
    return true;
  }, [showModal]);

  const handleScreenToggle = useCallback(async () => {
    if (loading) return;

    try {
      setLoading(true);

      if (!checkElectronAPI()) {
        setLoading(false);
        return;
      }

      if (!isSecondaryScreenActive) {
        console.log('MainScreen: Attempting to open secondary window');
        await window.electronAPI.openSecondaryWindow();
        setIsSecondaryScreenActive(true);
        showModal('Success', 'Secondary screen turned on successfully!', 'success');
      } else {
        console.log('MainScreen: Attempting to close secondary window');
        const success = await window.electronAPI.closeSecondaryWindow();

        if (success) {
          setIsSecondaryScreenActive(false);
          showModal('Success', 'Secondary screen turned off successfully!', 'success');
        } else {
          showModal('Error', 'Secondary screen is not active.');
        }
      }
    } catch (error) {
      console.error('MainScreen: Error toggling secondary screen:', error);
      showModal('Error', `Failed to ${isSecondaryScreenActive ? 'deactivate' : 'activate'} the secondary screen. Please try again.`);
    } finally {
      setLoading(false);
    }
  }, [loading, isSecondaryScreenActive, checkElectronAPI, showModal]);

  // Verse display management
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

  // Navigation handlers
  const handleChapterSelect = (chapterNumber) => {
    setSelectedChapter(chapterNumber);
    setSelectedVerse(null);
  };



  return (
    <div className="container">
      {/* Modal */}
      <Modal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        onClose={closeModal}
      />

      {/* Sidebar */}
      <SidebarSection
        books={books}
        selectedBook={selectedBook}
        selectedChapter={selectedBook}
        selectedVersion={selectedVersion}
        setSelectedBook={setSelectedBook}
        setSelectedVersion={setSelectedVersion}
        setSelectedChapter={setSelectedChapter}
        showVersions={showVersions}
        setShowVersions={setShowVersions}
        versions={versions}
      />
      <ChapterSection
        chapters={chapters}
        handleChapterSelect={handleChapterSelect}
      />

      {/* MainContent */}
      <MainContent
        handleScreenToggle={handleScreenToggle}
        handleVerseDisplay={handleVerseDisplay}
        loading={loading}
        selectedBook={selectedBook}
        selectedChapter={selectedChapter}
        selectedVersion={selectedVersion}
        setSelectedBook={setSelectedBook}
        isSecondaryScreenActive={isSecondaryScreenActive}
        selectedVerse={selectedVerse}
        verses={verses}
        displayVerse={displayVerse}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </div>
  );
};

export default MainScreen;