import React from 'react'
import '../../assets/css/main.css'

const ChapterSection = ({chapters, handleChapterSelect}) => {
	return (
		<div className="controls">
			<div className="search-container">
				<label>Chapters</label>
				<div className="chapters-grid">
					{chapters.map((chapter) => (
						<button
							key={chapter.number}
							className="chapter-button"
							onClick={() => handleChapterSelect(chapter.number)}
						>
							<span>
								 {chapter.number}
							</span>
						</button>
					))}
				</div>
			</div>
		</div>
	)
}

export default ChapterSection