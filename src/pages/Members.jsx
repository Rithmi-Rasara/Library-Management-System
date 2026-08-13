import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { formatDate } from '../services/utils';

const Members = () => {
    const { members, addMember } = useLibrary();
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newMember, setNewMember] = useState({ name: '', email: '', phone: '' });

    const displayedMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddSubmit = (e) => {
        e.preventDefault();
        if (!newMember.name || !newMember.email) return;

        addMember(newMember);
        setShowAddForm(false);
        setNewMember({ name: '', email: '', phone: '' });
    };

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className="page-title text-gradient">Members Hub</h1>
                    <p className="page-subtitle" style={{ marginBottom: 0 }}>
                        Members stored using a Circular Linked List
                    </p>
                </div>

                <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
                    {showAddForm ? '⨯ Cancel' : '+ Register Member'}
                </button>
            </div>

            <div className="glass-panel" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
                <strong>Circular Linked List:</strong>{' '}
                the last member node points back to the first member node.
                This supports continuous/cyclic traversal.
                Current nodes: <strong>{members.length}</strong>
            </div>

            {showAddForm && (
                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Register New Member</h3>

                    <form onSubmit={handleAddSubmit} style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1.5rem'
                    }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Full Name</label>
                            <input type="text" className="form-input" value={newMember.name}
                                onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                                required placeholder="e.g. John Doe" />
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Email Address</label>
                            <input type="email" className="form-input" value={newMember.email}
                                onChange={e => setNewMember({ ...newMember, email: e.target.value })}
                                required placeholder="e.g. john@example.com" />
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Phone Number</label>
                            <input type="text" className="form-input" value={newMember.phone}
                                onChange={e => setNewMember({ ...newMember, phone: e.target.value })}
                                placeholder="e.g. 077-1234567" />
                        </div>

                        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" className="btn btn-primary">Register Member</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search members by name, ID or email..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{ maxWidth: '450px' }}
                    />
                </div>

                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Member ID</th>
                                <th>Name</th>
                                <th>Contact info</th>
                                <th>Join Date</th>
                                <th>Active Loans</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedMembers.map(member => (
                                <tr key={member.id}>
                                    <td style={{ color: 'var(--text-muted)' }}>{member.id}</td>
                                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{member.name}</td>
                                    <td>
                                        <div>{member.email}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {member.phone || 'No phone'}
                                        </div>
                                    </td>
                                    <td>{formatDate(member.registeredDate)}</td>
                                    <td>{member.activeLoans}</td>
                                    <td>
                                        {member.activeLoans > 2
                                            ? <span className="badge badge-warning">Multiple Loans</span>
                                            : <span className="badge badge-success">Good</span>}
                                    </td>
                                </tr>
                            ))}

                            {displayedMembers.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                        No members found matching your search.
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

export default Members;
