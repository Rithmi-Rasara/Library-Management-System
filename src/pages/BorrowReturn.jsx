import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { formatDate } from '../services/utils';

const BorrowReturn = () => {
    const {
        books, members, borrowRecords,
        borrowQueue, returnQueue,
        enqueueBorrow, processNextBorrow,
        enqueueReturn, processNextReturn
    } = useLibrary();

    const [activeTab, setActiveTab] = useState('active');
    const [selectedBookId, setSelectedBookId] = useState('');
    const [selectedMemberId, setSelectedMemberId] = useState('');
    const [message, setMessage] = useState('');

    const activeLoans = borrowRecords.filter(r => r.status === 'BORROWED');
    const pastLoans = borrowRecords
        .filter(r => r.status === 'RETURNED')
        .sort((a, b) => new Date(b.returnDate) - new Date(a.returnDate));
    const availableBooks = books.filter(b => b.availableCopies > 0);

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(''), 3000);
    };

    const getBookTitle = id => books.find(b => b.id === id)?.title || 'Unknown Book';
    const getMemberName = id => members.find(m => m.id === id)?.name || 'Unknown Member';

    const handleBorrowSubmit = e => {
        e.preventDefault();

        const result = enqueueBorrow(selectedBookId, selectedMemberId);

        if (result.success) {
            showMessage('success', 'Borrow request added to FIFO queue.');
            setSelectedBookId('');
            setSelectedMemberId('');
            setActiveTab('queues');
        } else {
            showMessage('error', result.message);
        }
    };

    const handleProcessBorrow = () => {
        const result = processNextBorrow();
        showMessage(result.success ? 'success' : 'error', result.message);
    };

    const handleQueueReturn = recordId => {
        const result = enqueueReturn(recordId);
        showMessage(result.success ? 'success' : 'error', result.message);

        if (result.success) setActiveTab('queues');
    };

    const handleProcessReturn = () => {
        const result = processNextReturn();
        showMessage(result.success ? 'success' : 'error', result.message);
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className="page-title text-gradient">Circulation Desk</h1>
                    <p className="page-subtitle" style={{ marginBottom: 0 }}>
                        Borrow and return requests use FIFO Queues
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <button className={`btn ${activeTab === 'active' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('active')}>Active Loans</button>
                    <button className={`btn ${activeTab === 'history' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('history')}>History</button>
                    <button className={`btn ${activeTab === 'borrow' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('borrow')}>+ New Borrow</button>
                    <button className={`btn ${activeTab === 'queues' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('queues')}>
                        Queues ({borrowQueue.length + returnQueue.length})
                    </button>
                </div>
            </div>

            {message && (
                <div style={{
                    padding: '1rem 1.5rem',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1.5rem',
                    backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: message.type === 'success' ? 'var(--success)' : 'var(--danger)'
                }}>
                    {message.text}
                </div>
            )}

            {activeTab === 'borrow' && (
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>Issue a Book</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        The request is inserted at the rear of the Borrow Queue.
                    </p>

                    <form onSubmit={handleBorrowSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Select Book</label>
                            <select className="form-input" value={selectedBookId} onChange={e => setSelectedBookId(e.target.value)} required>
                                <option value="">-- Choose a book --</option>
                                {availableBooks.map(b =>
                                    <option key={b.id} value={b.id}>{b.title} (Available: {b.availableCopies})</option>
                                )}
                            </select>
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Select Member</label>
                            <select className="form-input" value={selectedMemberId} onChange={e => setSelectedMemberId(e.target.value)} required>
                                <option value="">-- Choose a member --</option>
                                {members.map(m =>
                                    <option key={m.id} value={m.id}>{m.name} ({m.id})</option>
                                )}
                            </select>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            Add to Borrow Queue
                        </button>
                    </form>
                </div>
            )}

            {activeTab === 'queues' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.2rem' }}>📥 Borrow Queue</h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>FIFO • Front → Rear</p>
                            </div>
                            <span className="badge badge-primary">{borrowQueue.length} waiting</span>
                        </div>

                        {borrowQueue.length === 0
                            ? <p style={{ color: 'var(--text-muted)' }}>Borrow queue is empty.</p>
                            : <>
                                {borrowQueue.map((request, index) => (
                                    <div key={request.id} style={{
                                        padding: '1rem',
                                        marginBottom: '0.75rem',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: 'var(--radius-md)'
                                    }}>
                                        <div className="flex justify-between">
                                            <strong>#{index + 1} {request.id}</strong>
                                            {index === 0 && <span className="badge badge-success">FRONT</span>}
                                        </div>
                                        <div style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>{getBookTitle(request.bookId)}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{getMemberName(request.memberId)}</div>
                                    </div>
                                ))}
                                <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleProcessBorrow}>
                                    Process Front Borrow Request
                                </button>
                            </>
                        }
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.2rem' }}>📤 Return Queue</h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>FIFO • Front → Rear</p>
                            </div>
                            <span className="badge badge-warning">{returnQueue.length} waiting</span>
                        </div>

                        {returnQueue.length === 0
                            ? <p style={{ color: 'var(--text-muted)' }}>Return queue is empty.</p>
                            : <>
                                {returnQueue.map((request, index) => {
                                    const record = borrowRecords.find(r => r.id === request.recordId);

                                    return (
                                        <div key={request.id} style={{
                                            padding: '1rem',
                                            marginBottom: '0.75rem',
                                            border: '1px solid var(--glass-border)',
                                            borderRadius: 'var(--radius-md)'
                                        }}>
                                            <div className="flex justify-between">
                                                <strong>#{index + 1} {request.id}</strong>
                                                {index === 0 && <span className="badge badge-success">FRONT</span>}
                                            </div>
                                            <div style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                                                {record ? getBookTitle(record.bookId) : 'Invalid Record'}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                {record ? getMemberName(record.memberId) : ''}
                                            </div>
                                        </div>
                                    );
                                })}

                                <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleProcessReturn}>
                                    Process Front Return Request
                                </button>
                            </>
                        }
                    </div>
                </div>
            )}

            {activeTab === 'active' && (
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div className="data-table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Record ID</th>
                                    <th>Book</th>
                                    <th>Member</th>
                                    <th>Borrow Date</th>
                                    <th>Fine (Rs)</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeLoans.map(record => (
                                    <tr key={record.id}>
                                        <td>{record.id}</td>
                                        <td>{getBookTitle(record.bookId)}</td>
                                        <td>{getMemberName(record.memberId)}</td>
                                        <td>{formatDate(record.borrowDate)}</td>
                                        <td>Rs. {record.fine}</td>
                                        <td>
                                            <button
                                                onClick={() => handleQueueReturn(record.id)}
                                                className="btn btn-secondary"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                            >
                                                Add Return to Queue
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {activeLoans.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                            No active loans currently.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'history' && (
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div className="data-table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Record ID</th>
                                    <th>Book</th>
                                    <th>Member</th>
                                    <th>Borrow Date</th>
                                    <th>Return Date</th>
                                    <th>Fine Paid</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pastLoans.map(record => (
                                    <tr key={record.id}>
                                        <td>{record.id}</td>
                                        <td>{getBookTitle(record.bookId)}</td>
                                        <td>{getMemberName(record.memberId)}</td>
                                        <td>{formatDate(record.borrowDate)}</td>
                                        <td>{formatDate(record.returnDate)}</td>
                                        <td>Rs. {record.fine}</td>
                                    </tr>
                                ))}

                                {pastLoans.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                            No return history.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BorrowReturn;
