import React, { useState } from 'react';
import { BiSearch, BiBook, BiBook as BiPresentation } from 'react-icons/bi';
import BibleSection from '../bible/BibleSection';

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
	const [activeTab, setActiveTab] = useState('bible');

	const filteredBooks = books.filter(book =>
		book.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const tabs = [
		{ id: 'bible', label: 'Bible', icon: BiBook },
		{ id: 'presentation', label: 'Presentation', icon: BiPresentation }
	];

	return (
		<div className="w-full max-w-[288px] bg-white border-r border-slate-200 h-screen p-4 flex flex-col">
			{/* Tabs */}
			<div className="flex mb-6 bg-blue-700 p-2 rounded-lg">
				{tabs.map(tab => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						className={`flex items-center px-4 h-10 rounded-lg text-sm font-medium flex-1 transform transition-all duration-300 ease-out
              ${activeTab === tab.id
								? 'bg-white text-blue-700 scale-105 shadow-lg'
								: 'text-white hover:bg-white/10 hover:scale-95'}`}
					>
						<tab.icon className={`w-4 h-4 mr-2 transition-transform duration-300 ${activeTab === tab.id ? 'rotate-12' : ''}`} />
						<span className="transition-colors duration-300">{tab.label}</span>
					</button>
				))}
			</div>

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
				<div className="flex-1 flex items-center justify-center text-gray-500">
					Presentation features coming soon...
				</div>
			)}
		</div>
	);
};

export default SidebarSection;