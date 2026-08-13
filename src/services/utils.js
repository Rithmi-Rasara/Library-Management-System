export const BORROW_PERIOD_DAYS = 14;
export const FINE_PER_DAY = 5;

export const generateId = (prefix) => {
    return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
};

export const calculateFine = (record) => {
    const borrowDate = new Date(record.borrowDate);
    const now = record.returnDate ? new Date(record.returnDate) : new Date();

    // Calculate expected return date
    const expectedReturnDate = new Date(borrowDate);
    expectedReturnDate.setDate(borrowDate.getDate() + BORROW_PERIOD_DAYS);

    if (now > expectedReturnDate) {
        const diffTime = Math.abs(now - expectedReturnDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays * FINE_PER_DAY;
    }
    return 0;
};

export const isOverdue = (record) => {
    if (record.status === 'RETURNED') return false;

    const borrowDate = new Date(record.borrowDate);
    const now = new Date();

    const expectedReturnDate = new Date(borrowDate);
    expectedReturnDate.setDate(borrowDate.getDate() + BORROW_PERIOD_DAYS);

    return now > expectedReturnDate;
};

export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(new Date(dateString));
};
