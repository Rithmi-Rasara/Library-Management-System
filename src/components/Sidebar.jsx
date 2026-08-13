import React from 'react';

const Sidebar = ({ currentView, setCurrentView }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'books', label: 'Books Catalog', icon: '📚' },
        { id: 'members', label: 'Members', icon: '👥' },
        { id: 'borrow', label: 'Borrow & Return', icon: '🔄' },
    ];

    return (
        <aside className="sidebar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
                <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)' }}>
                    📖
                </div>
                <div>
                    <h2 style={{ fontSize: '1.25rem', margin: 0, lineHeight: 1.2 }}>LMS</h2>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>NIBM Library</span>
                </div>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {menuItems.map(item => {
                    const isActive = currentView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setCurrentView(item.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0.875rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                border: 'none',
                                background: isActive ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                textAlign: 'left',
                                fontSize: '0.95rem',
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: isActive ? '600' : '500',
                                transition: 'all var(--transition-fast)',
                                borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent'
                            }}
                            onMouseOver={(e) => {
                                if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                            }}
                            onMouseOut={(e) => {
                                if (!isActive) e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    &copy; 2026 NIBM Library App<br />
                    React Migration
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
