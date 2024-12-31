import React, { useState } from 'react';
import { BiSearch, BiBook, BiBook as BiPresentation } from 'react-icons/bi';
import BibleSection from '../bible/BibleSection';
import TabSelection from './TabSelection';
import PresentationSection from '../presentation/PresentationSection';

const SidebarSection = ({
	selectedVersion,
	setSelectedVersion,
	versions,
	books,
	selectedBook,
	setSelectedBook,
	selectedChapter,
	setSelectedChapter,
	activeTab,
	setActiveTab,
	tabs,
	onSelectPresentation
}) => {
	const [searchQuery, setSearchQuery] = useState('');


	const filteredBooks = books.filter(book =>
		book.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleSelectPresentation = (presentation) => {
		console.log('SidebarSection: Selected Presentation', presentation);
		onSelectPresentation(presentation); // Call the parent callback to open the selected presentation in the secondary screen
		// Pass this to MainScreen or handle as needed
	};


	return (
		<div className="w-full max-w-[288px] bg-white border-r border-slate-200 h-screen p-4 flex flex-col">
			{/* Tabs */}
			<TabSelection
				activeTab={activeTab}
				tabs={tabs}
				setActiveTab={setActiveTab}
			/>

			{/* Rest of the component remains the same */}
			{activeTab === 'bible' ? (
				<BibleSection
					filteredBooks={filteredBooks}
					searchQuery={searchQuery}
					setSelectedBook={setSelectedBook}
					selectedBook={selectedBook}
					selectedChapter={selectedChapter}
					setSelectedChapter={setSelectedChapter}
					selectedVersion={selectedVersion}
					setSelectedVersion={setSelectedVersion}
					versions={versions}
					setSearchQuery={setSearchQuery}
					books={books}
				/>
			) : (
				<PresentationSection
					onSelectPresentation={handleSelectPresentation}
				/>
			)}
		</div>
	);
};

export default SidebarSection;