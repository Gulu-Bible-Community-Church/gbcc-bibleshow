import React, { useState } from 'react';
import { Search, Book, Check } from 'lucide-react';
import '../../assets/css/sidebar.css';
import VersionSelection from './VersionSelection';
import BookListSection from './BookListSection';

const SidebarSection = ({
	selectedVersion,
	setSelectedVersion,
	versions,
	books,
	selectedBook,
	setSelectedBook,
	selectedChapter,
	setSelectedChapter
}) => {
	const [searchQuery, setSearchQuery] = useState('');

	// Filter books based on search query
	const filteredBooks = books.filter(book =>
		book.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="sidebar">
			{/* VersionSelection */}
			<VersionSelection
				selectedVersion={selectedVersion}
				setSelectedVersion={setSelectedVersion}
				versions={versions}
			/>

			{/* Search Bar */}
			<div className="search-container">
				<Search className="search-icon" />
				<input
					type="text"
					className="search-input"
					placeholder="Search books..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>

			{/* BookList */}
			<BookListSection
				filteredBooks={filteredBooks}
				selectedBook={selectedBook}
				setSelectedBook={setSelectedBook}
				selectedChapter={selectedChapter}
				setSelectedChapter={setSelectedChapter}
				searchQuery={searchQuery}
			/>
		</div>
	);
};

export default SidebarSection;