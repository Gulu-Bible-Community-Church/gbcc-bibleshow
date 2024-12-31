import React from 'react'
import VersionSelection from '../home/VersionSelection';
import BookListSection from '../home/BookListSection';

const BibleSection = ({
	versions,
	setSelectedVersion,
	selectedVersion,
	searchQuery,
	setSearchQuery,
	filteredBooks,
	setSelectedBook,
	selectedBook,
	setSelectedChapter
}) => {
	return (
		<>
			<VersionSelection
				selectedVersion={selectedVersion}
				versions={versions}
				setSelectedVersion={setSelectedVersion}
			/>
			<BookListSection
				filteredBooks={filteredBooks}
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				setSelectedBook={setSelectedBook}
				selectedBook={selectedBook}
				setSelectedChapter={setSelectedChapter}
				selectedVersion={selectedVersion}
			/>
		</>
	)
}
export default BibleSection