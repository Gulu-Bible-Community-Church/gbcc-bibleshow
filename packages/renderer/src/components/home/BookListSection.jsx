import React from 'react'
import { BiBook, BiSearch } from 'react-icons/bi';

const BookListSection = ({ filteredBooks, setSelectedBook, setSelectedChapter, searchQuery, selectedBook, setSearchQuery  }) => {
	return (
		<>
			<div className="relative mb-4">
				<BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
				<input
					type="text"
					className="w-full py-2 pl-10 pr-4 border border-gray-200 rounded-lg text-sm transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
					placeholder="Search books..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>

			<div className="flex-1 overflow-hidden flex flex-col">
				<label className="text-sm font-medium text-gray-800 mb-2">
					Books
				</label>
				<div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
					{filteredBooks.map(book => (
						<div
							key={book.name}
							onClick={() => {
								setSelectedBook(book.name);
								setSelectedChapter(null);
							}}
							className={`flex items-center py-2 px-3 mb-1 rounded-lg cursor-pointer transition-all duration-200
						${selectedBook === book.name
									? 'bg-blue-100 text-blue-700'
									: 'hover:bg-gray-100'}`}
						>
							<BiBook className="mr-3 w-4 h-4 flex-shrink-0" />
							<span className="truncate">{book.name}</span>
						</div>
					))}
					{filteredBooks.length === 0 && (
						<div className="text-center py-4 text-gray-500 text-sm">
							Select a bible Version
						</div>
					)}
				</div>
			</div>
		</>
	)
}

export default BookListSection