import React, { useMemo, useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import {
    getRecommendations,
    getExpiryAlerts,
    getSmartExpiryStatus,
    predictFine
} from '../services/dataStructures/smartFeatures';

const Dashboard = ({ navigate }) => {
    const { books, members, borrowRecords } = useLibrary();
    const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id || '');

    const totalBooks = books.reduce((acc, curr) => acc + curr.quantity, 0);
    const activeLoans = borrowRecords.filter(r => r.status === 'BORROWED').length;
    const overdueLoans = borrowRecords.filter(r => r.status === 'BORROWED' && r.fine > 0).length;
    const totalMembers = members.length;

    const popularBooks = [...books]
        .sort((a, b) => b.borrowCount - a.borrowCount)
        .slice(0, 4);

    const overdueRecordsList = borrowRecords
        .filter(r => r.status === 'BORROWED' && r.fine > 0)
        .map(r => {
            const b = books.find(book => book.id === r.bookId);
            const m = members.find(member => member.id === r.memberId);
            return { ...r, bookTitle: b?.title, memberName: m?.name };
        });

    const recommendations = useMemo(
        () => getRecommendations(selectedMemberId, books, borrowRecords, 5),
        [selectedMemberId, books, borrowRecords]
    );

    const expiryAlerts = useMemo(
        () => getExpiryAlerts(borrowRecords),
        [borrowRecords]
    );

    const predictedFineTotal = borrowRecords
        .filter(r => r.status === 'BORROWED')
        .reduce((sum, record) => sum + predictFine(record, 7), 0);

    return (
        <div className="animate-fade-in">
            <h1 className="page-title text-gradient">Dashboard Hub</h1>
            <p className="page-subtitle">
                Modern Library Management System with smart data structures
            </p>

            <div className="grid-cards" style={{ marginBottom: '3rem' }}>
                <div className="glass-card stat-card">
                    <div className="stat-icon">📚</div>
                    <div className="stat-info">
                        <h3>Total Books</h3>
                        <div className="stat-value">{totalBooks}</div>
                    </div>
                </div>

                <div className="glass-card stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <h3>Active Members</h3>
                        <div className="stat-value">{totalMembers}</div>
                    </div>
                </div>

                <div className="glass-card stat-card">
                    <div className="stat-icon">🔄</div>
                    <div className="stat-info">
                        <h3>Active Loans</h3>
                        <div className="stat-value">{activeLoans}</div>
                    </div>
                </div>

                <div className="glass-card stat-card">
                    <div className="stat-icon">⚠️</div>
                    <div className="stat-info">
                        <h3>Overdue Loans</h3>
                        <div className="stat-value">{overdueLoans}</div>
                    </div>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                gap: '2rem',
                marginBottom: '2rem'
            }}>
                <section className="glass-panel" style={{ padding: '2rem' }}>
                    <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem' }}>🔥 Popular Reads</h2>
                        <button className="btn btn-secondary"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                            onClick={() => navigate('books')}>
                            View All
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {popularBooks.map((book, index) => (
                            <div key={book.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.02)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--glass-border)'
                            }}>
                                <div style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    color: 'var(--text-muted)',
                                    width: '30px',
                                    textAlign: 'center'
                                }}>
                                    #{index + 1}
                                </div>

                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1rem' }}>
                                        {book.title}
                                    </h4>
                                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                        {book.author}
                                    </p>
                                </div>

                                <div className="badge badge-primary">
                                    Borrowed {book.borrowCount} times
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="glass-panel" style={{ padding: '2rem' }}>
                    <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem' }}>🚨 Attention Required</h2>
                        <button className="btn btn-secondary"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                            onClick={() => navigate('borrow')}>
                            Manage
                        </button>
                    </div>

                    {overdueRecordsList.length === 0 ? (
                        <div style={{
                            padding: '2rem',
                            textAlign: 'center',
                            color: 'var(--text-secondary)'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                            <p>No overdue books.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {overdueRecordsList.slice(0, 4).map(record => (
                                <div key={record.id} style={{
                                    borderLeft: '3px solid var(--danger)',
                                    padding: '1rem',
                                    background: 'rgba(239, 68, 68, 0.05)',
                                    borderRadius: 'var(--radius-md)'
                                }}>
                                    <div className="flex justify-between">
                                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                                            {record.bookTitle}
                                        </span>
                                        <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>
                                            Rs. {record.fine}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        Borrowed by <strong>{record.memberName}</strong>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* Novel Feature 1: Recommendations */}
            <section className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem' }}>🤖 Smart Book Recommendations</h2>
                        <p style={{ margin: '0.4rem 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            Genre preference + popularity + availability scoring
                        </p>
                    </div>

                    <select
                        className="form-input"
                        value={selectedMemberId}
                        onChange={e => setSelectedMemberId(e.target.value)}
                        style={{ maxWidth: '260px' }}
                    >
                        {members.map(member => (
                            <option key={member.id} value={member.id}>
                                {member.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1rem'
                }}>
                    {recommendations.map(book => (
                        <div key={book.id} className="glass-card" style={{ padding: '1.2rem' }}>
                            <div className="badge badge-primary" style={{ marginBottom: '0.8rem' }}>
                                Match {book.recommendationScore}%
                            </div>
                            <h3 style={{ fontSize: '1rem', margin: '0 0 0.35rem' }}>{book.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{book.author}</p>
                            <small style={{ color: 'var(--text-muted)' }}>
                                {book.genre} • {book.availableCopies} available
                            </small>
                        </div>
                    ))}

                    {recommendations.length === 0 && (
                        <p style={{ color: 'var(--text-muted)' }}>
                            No recommendation candidates available.
                        </p>
                    )}
                </div>
            </section>

            {/* Novel Feature 2: Smart Expiry */}
            <section className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem' }}>⏰ Smart Expiry Monitor</h2>
                        <p style={{ margin: '0.4rem 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            Highlights loans that are due soon or already overdue
                        </p>
                    </div>

                    <span className="badge badge-warning">
                        {expiryAlerts.length} alert(s)
                    </span>
                </div>

                {borrowRecords.filter(r => r.status === 'BORROWED').length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No active loans.</p>
                ) : (
                    <div className="data-table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Book</th>
                                    <th>Member</th>
                                    <th>Expiry Status</th>
                                    <th>Current Fine</th>
                                </tr>
                            </thead>
                            <tbody>
                                {borrowRecords
                                    .filter(r => r.status === 'BORROWED')
                                    .map(record => {
                                        const book = books.find(b => b.id === record.bookId);
                                        const member = members.find(m => m.id === record.memberId);
                                        const expiry = getSmartExpiryStatus(record);

                                        return (
                                            <tr key={record.id}>
                                                <td>{book?.title || 'Unknown'}</td>
                                                <td>{member?.name || 'Unknown'}</td>
                                                <td>
                                                    <span className={`badge ${
                                                        expiry.risk === 'HIGH'
                                                            ? 'badge-danger'
                                                            : expiry.risk === 'MEDIUM'
                                                                ? 'badge-warning'
                                                                : 'badge-success'
                                                    }`}>
                                                        {expiry.label}
                                                    </span>
                                                </td>
                                                <td>Rs. {record.fine}</td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* Novel Feature 3: Fine Prediction */}
            <section className="glass-panel" style={{ padding: '2rem' }}>
                <div className="flex justify-between items-center">
                    <div>
                        <h2 style={{ fontSize: '1.25rem' }}>💰 Fine Prediction</h2>
                        <p style={{ margin: '0.4rem 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            Rule-based estimate if active loans remain open for another 7 days
                        </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            Projected total
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--danger)' }}>
                            Rs. {predictedFineTotal}
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '1.5rem' }} className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Book</th>
                                <th>Member</th>
                                <th>Current Fine</th>
                                <th>7-Day Predicted Fine</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrowRecords
                                .filter(r => r.status === 'BORROWED')
                                .map(record => {
                                    const book = books.find(b => b.id === record.bookId);
                                    const member = members.find(m => m.id === record.memberId);
                                    const predicted = predictFine(record, 7);

                                    return (
                                        <tr key={record.id}>
                                            <td>{book?.title || 'Unknown'}</td>
                                            <td>{member?.name || 'Unknown'}</td>
                                            <td>Rs. {record.fine}</td>
                                            <td style={{
                                                fontWeight: 700,
                                                color: predicted > record.fine
                                                    ? 'var(--danger)'
                                                    : 'var(--success)'
                                            }}>
                                                Rs. {predicted}
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
