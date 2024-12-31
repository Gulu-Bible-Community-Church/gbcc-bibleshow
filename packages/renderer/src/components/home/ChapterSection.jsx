import React, { useState } from 'react';

const ChapterSection = ({ chapters, handleChapterSelect }) => {
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedVerse, setSelectedVerse] = useState(null);


  const handleSelectChapter = (chapter) => {
	console.log('Selected chapter number:', chapter.number, chapter);
    setSelectedChapter(chapter);
    handleChapterSelect(chapter.number); // Passing the chapter number as needed
  };

  const handleVerseClick = (verse) => {

    console.log('Verse selected:', {
      number: verse.number,
      text: verse.text,
    });
    setSelectedVerse(verse);
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <div className="space-y-6">
        <div>
          <label className="block text-xl font-semibold mb-3">Chapters</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {chapters.map((chapter) => (
              <button
                key={chapter.number}
                onClick={() => handleSelectChapter(chapter)}
                className={`h-10 w-10 flex items-center justify-center rounded-lg 
                          border transition-colors duration-150 font-medium
                          ${selectedChapter?.number === chapter.number 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'}`}
              >
                <span>{chapter.number}</span>
              </button>
            ))}
          </div>
        </div>

        {selectedChapter && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Chapter {selectedChapter.number}</h3>
            <div className="space-y-4">
              {selectedChapter.verses.map((verse) => (
                <div
                  key={verse.number}
                  className={`flex cursor-pointer p-2 rounded-lg hover:bg-gray-50
                            ${selectedVerse?.number === verse.number ? 'bg-blue-50' : ''}`}
                  onClick={() => handleVerseClick(verse)}
                >
                  <span className="text-sm font-medium text-gray-500 mr-3 mt-1 w-6 flex-shrink-0">
                    {verse.number}
                  </span>
                  <p className="text-gray-700">{verse.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterSection;
