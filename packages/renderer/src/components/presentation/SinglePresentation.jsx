import React, { useState } from 'react';

const SinglePresentation = ({ selectedPresentation }) => {
  const [slides, setSlides] = useState([]);

  const addSlide = () => {
    const newSlide = {
      id: slides.length + 1,
      title: `Slide ${slides.length + 1}`,
      content: `Content for Slide ${slides.length + 1}`,
    };
    setSlides([...slides, newSlide]);
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{selectedPresentation?.name}</h1>
      <button
        onClick={addSlide}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Add New Slide
      </button>
      <div className="mt-6">
        {slides.length > 0 ? (
          slides.map((slide) => (
            <div
              key={slide.id}
              className="border border-gray-300 p-4 rounded mb-4"
            >
              <h2 className="text-xl font-semibold">{slide?.title}</h2>
              <p>{slide.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No slides available. Add a new slide to get started.</p>
        )}
      </div>
    </div>
  );
};

export default SinglePresentation;
