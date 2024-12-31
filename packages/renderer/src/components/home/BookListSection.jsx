import React from 'react'
import { Book } from 'lucide-react';

const BookListSection = ({filteredBooks, setSelectedBook, setSelectedChapter, searchQuery, selectedBook}) => {
	return (
		<div className="books-section">
			<label className="books-label">Books</label>
			<div className="books-list">
				{filteredBooks.map(book => (
					<div
						key={book.name}
						onClick={() => {
							setSelectedBook(book.name);
							setSelectedChapter(null);
						}}
						className={`book-item ${selectedBook === book.name ? 'active' : ''}`}
					>
						<Book className="book-icon" />
						<span className="book-name">{book.name}</span>
					</div>
				))}
				{filteredBooks.length === 0 && (
					<div className="no-results">
						No books found matching "{searchQuery}"
					</div>
				)}
			</div>
		</div>
	)
}

export default BookListSection