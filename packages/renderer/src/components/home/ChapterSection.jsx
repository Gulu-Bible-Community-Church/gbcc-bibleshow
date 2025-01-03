import React, { useState, useCallback } from 'react';
import { BiBook, BiChevronLeft, BiChevronRight } from 'react-icons/bi';

const ChapterSection = ({
  chapters,
  handleChapterSelect,
  selectedVersion,
  handleVerseDisplay,
}) => {
  // Consolidated state management
  const [state, setState] = useState({
    selectedChapter: null,
    activeVerseIndex: 0,
    selectedVerse: null
  });

  // Navigation handler
  const navigateVerse = useCallback((direction) => {
    setState(prevState => {
      if (!prevState.selectedChapter) return prevState;

      const newIndex = prevState.activeVerseIndex + direction;
      const verses = prevState.selectedChapter.verses;

      if (newIndex < 0 || newIndex >= verses.length) return prevState;

      const nextVerse = verses[newIndex];
      if (!nextVerse || typeof nextVerse !== 'object') return prevState;

      // Update verse display
      handleVerseDisplay(nextVerse.text, nextVerse.number);

      return {
        ...prevState,
        activeVerseIndex: newIndex,
        selectedVerse: {
          number: nextVerse.number,
          text: nextVerse.text
        }
      };
    });
  }, [handleVerseDisplay]);

  // Chapter selection handler
  const handleSelectChapter = useCallback((chapter) => {
    setState({
      selectedChapter: chapter,
      activeVerseIndex: 0,
      selectedVerse: null
    });
    handleChapterSelect(chapter.number);
  }, [handleChapterSelect]);

  // Verse selection handler
  const handleVerseSelect = useCallback((verse, index) => {
    if (!verse || typeof verse !== 'object') return;

    setState(prevState => ({
      ...prevState,
      activeVerseIndex: index,
      selectedVerse: {
        number: verse.number,
        text: verse.text
      }
    }));
    handleVerseDisplay(verse.text, verse.number);
  }, [handleVerseDisplay]);

  // Navigation button states
  const canNavigatePrev = state.selectedVerse && state.activeVerseIndex > 0;
  const canNavigateNext = state.selectedVerse && 
    state.selectedChapter && 
    state.activeVerseIndex < state.selectedChapter.verses.length - 1;

  return (
    <div className="relative w-full max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <BiBook className="w-5 h-5 text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-800">Select Chapter</h2>
        </div>

        <div className="space-y-6">
          {/* Chapter Grid */}
          <div className="overflow-auto max-h-80 rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-8 gap-2">
              {chapters.map((chapter) => (
                <button
                  key={chapter.number}
                  onClick={() => handleSelectChapter(chapter)}
                  className={`h-10 w-10 rounded-lg font-medium transition-colors duration-200
                    ${state.selectedChapter?.number === chapter.number
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                  aria-label={`Chapter ${chapter.number}`}
                >
                  {chapter.number}
                </button>
              ))}
            </div>
          </div>

          {/* Verse Grid */}
          {state.selectedChapter && (
            <div>
              <h3 className="text-lg font-semibold mb-1 text-gray-700">Select Verse</h3>
              <div className="overflow-auto max-h-52 rounded-lg border border-gray-200 p-4">
                <div className="grid grid-cols-10 gap-2">
                  {state.selectedChapter.verses.map((verse, index) => (
                    <button
                      key={verse.number}
                      onClick={() => handleVerseSelect(verse, index)}
                      className={`h-10 w-10 rounded-lg font-medium transition-colors duration-200
                        ${state.activeVerseIndex === index
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                      aria-label={`Verse ${verse.number}`}
                    >
                      {verse.number}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Verse Display and Navigation */}
          {state.selectedVerse && (
            <div className="space-y-4 absolute bottom-4 left-4 right-4">
              <div className="bg-blue-500 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-200 font-bold">
                    Chapter {state.selectedChapter.number}, 
                    Verse {state.selectedVerse.number} • {selectedVersion}
                  </span>
                </div>
                <p className="text-gray-100 leading-relaxed">{state.selectedVerse.text}</p>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => navigateVerse(-1)}
                  disabled={!canNavigatePrev}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${!canNavigatePrev
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  aria-label="Previous verse"
                >
                  <BiChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>
 
                <button 
                  onClick={() => navigateVerse(1)}
                  disabled={!canNavigateNext}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${!canNavigateNext
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  aria-label="Next verse"
                >
                  Next
                  <BiChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterSection;