import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';

const Books = () => {
    const { books, searchBook, addBook } = useLibrary();
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        isbn: '',
        genre: '',
        year: new Date().getFullYear(),
        quantity: 1
    });

    const displayedBooks = searchTerm ? searchBook(searchTerm) : books;
    const isIdSearch = /^BOK-\d+$/i.test(searchTerm.trim());

    const handleAddSubmit = (e) => {
        e.preventDefault();

        if (!newBook.title || !newBook.author || !newBook.isbn) return;

        addBook(newBook);
        setShowAddForm(false);
        setNewBook({
            title: '',
            author: '',
            isbn: '',
            genre: '',
            year: new Date().getFullYear(),
            quantity: 1
        });
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className="page-title text-gradient">Book Catalog</h1>
                    <p className="page-subtitle" style={{ marginBottom: 0 }}>
                        Books: Doubly Linked List + BST search
                    </p>
                </div>

                <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
                    {showAddForm ? '⨯ Cancel' : '+ Add New Book'}
                </button>
            </div>

            {showAddForm && (
                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Add New Book</h3>

                    <form onSubmit={handleAddSubmit} style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1.5rem'
                    }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Title</label>
                            <input type="text" className="form-input" value={newBook.title}
                                onChange={e => setNewBook({ ...newBook, title: e.target.value })}
                                required placeholder="e.g. Clean Code" />
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Author</label>
                            <input type="text" className="form-input" value={newBook.author}
                                onChange={e => setNewBook({ ...newBook, author: e.target.value })}
                                required placeholder="e.g. Robert C. Martin" />
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">ISBN</label>
                            <input type="text" className="form-input" value={newBook.isbn}
                                onChange={e => setNewBook({ ...newBook, isbn: e.target.value })}
                                required placeholder="e.g. ISBN-1234" />
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Genre</label>
                            <input type="text" className="form-input" value={newBook.genre}
                                onChange={e => setNewBook({ ...newBook, genre: e.target.value })}
                                placeholder="e.g. Technology" />
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Published Year</label>
                            <input type="number" className="form-input" value={newBook.year}
                                onChange={e => setNewBook({ ...newBook, year: parseInt(e.target.value) || 0 })} />
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Quantity</label>
                            <input type="number" min="1" className="form-input" value={newBook.quantity}
                                onChange={e => setNewBook({ ...newBook, quantity: parseInt(e.target.value) || 1 })} />
                        </div>

                        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" className="btn btn-primary">Save Book</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search title, author, ISBN or Book ID..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{ maxWidth: '500px' }}
                    />

                    {searchTerm && (
                        <span className="badge badge-info">
                            {isIdSearch ? 'BST ID Search • O(h)' : 'Text Search • O(n)'}
                        </span>
                    )}
                </div>

                <div style={{
                    marginBottom: '1.5rem',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(139, 92, 246, 0.07)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem'
                }}>
                    <strong>Data structure:</strong> Books are stored in a Doubly Linked List.
                    Exact Book ID searches use a Binary Search Tree (BST). AVL Tree is not used.
                </div>

                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ISBN</th>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Genre</th>
                                <th>Copies Available</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {displayedBooks.map(book => (
                                <tr key={book.id}>
                                    <td style={{ color: 'var(--text-muted)' }}>{book.isbn}</td>
                                    <td>
                                        <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{book.title}</div>
                                        <small style={{ color: 'var(--text-muted)' }}>{book.id}</small>
                                    </td>
                                    <td>{book.author}</td>
                                    <td><span className="badge badge-info">{book.genre}</span></td>
                                    <td>{book.availableCopies} / {book.quantity}</td>
                                    <td>
                                        {book.availableCopies > 0 ? (
                                            <span className="badge badge-success">Available</span>
                                        ) : (
                                            <span className="badge badge-danger">Out of Stock</span>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {displayedBooks.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{
                                        textAlign: 'center',
                                        padding: '3rem',
                                        color: 'var(--text-muted)'
                                    }}>
                                        No books found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Books;
