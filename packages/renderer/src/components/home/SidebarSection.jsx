import React from 'react'
import '../../assets/css/main.css'
import { FaBible, FaChevronDown } from 'react-icons/fa';

const SidebarSection = ({ selectedVersion, setSelectedVersion, versions, showVersions, setShowVersions, books, selectedBook, setSelectedBook, selectedChapter, setSelectedChapter }) => {
	return (
		<div className="sidebar">
			<div className="version-selector">
				<label>Bible Version</label>
				<div className="version-button" onClick={() => setShowVersions(!showVersions)}>
					<span>{selectedVersion}</span>
					<FaChevronDown className="w-4 h-4" />
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
							onClick={() => {
								setSelectedBook(book.name);
								setSelectedChapter(null);
							}}
						>
							<FaBible className="w-4 h-4 inline mr-2" />
							{book.name}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default SidebarSection