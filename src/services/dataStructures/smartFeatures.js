import { BORROW_PERIOD_DAYS, FINE_PER_DAY } from '../utils';

/*
 * Smart Expiry
 * Calculates how many days remain before a loan becomes overdue.
 */
export const getLoanDueDate = (borrowDate) => {
    const due = new Date(borrowDate);
    due.setDate(due.getDate() + BORROW_PERIOD_DAYS);
    return due;
};

export const getSmartExpiryStatus = (record, now = new Date()) => {
    if (record.status === 'RETURNED') {
        return {
            status: 'RETURNED',
            label: 'Returned',
            daysRemaining: 0,
            risk: 'NONE'
        };
    }

    const dueDate = getLoanDueDate(record.borrowDate);
    const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return {
            status: 'OVERDUE',
            label: `${Math.abs(diffDays)} day(s) overdue`,
            daysRemaining: diffDays,
            risk: 'HIGH',
            dueDate
        };
    }

    if (diffDays <= 2) {
        return {
            status: 'DUE_SOON',
            label: `Due in ${diffDays} day(s)`,
            daysRemaining: diffDays,
            risk: 'MEDIUM',
            dueDate
        };
    }

    return {
        status: 'ON_TRACK',
        label: `${diffDays} day(s) remaining`,
        daysRemaining: diffDays,
        risk: 'LOW',
        dueDate
    };
};

/*
 * Fine Prediction
 * Estimates the fine if an active loan is returned 7 days from now.
 * This is a rule-based prediction, not machine learning.
 */
export const predictFine = (record, daysAhead = 7, now = new Date()) => {
    if (record.status === 'RETURNED') {
        return Number(record.fine || 0);
    }

    const futureDate = new Date(now);
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const dueDate = getLoanDueDate(record.borrowDate);
    const overdueMs = futureDate - dueDate;

    if (overdueMs <= 0) return 0;

    const overdueDays = Math.ceil(overdueMs / (1000 * 60 * 60 * 24));
    return overdueDays * FINE_PER_DAY;
};

/*
 * Recommendation Engine
 * Uses member borrowing history + book popularity + genre matching.
 */
export const getRecommendations = (memberId, books, borrowRecords, limit = 5) => {
    const memberRecords = borrowRecords.filter(r => r.memberId === memberId);
    const borrowedBookIds = new Set(memberRecords.map(r => r.bookId));

    const preferredGenres = {};
    memberRecords.forEach(record => {
        const book = books.find(b => b.id === record.bookId);
        if (book) {
            preferredGenres[book.genre] = (preferredGenres[book.genre] || 0) + 1;
        }
    });

    const maxGenreScore = Math.max(1, ...Object.values(preferredGenres));

    return [...books]
        .filter(book => !borrowedBookIds.has(book.id) && book.availableCopies > 0)
        .map(book => {
            const genreScore = (preferredGenres[book.genre] || 0) / maxGenreScore;
            const popularityScore = Math.min((book.borrowCount || 0) / 5, 1);
            const availabilityScore = book.availableCopies / Math.max(book.quantity, 1);

            const score =
                genreScore * 0.55 +
                popularityScore * 0.30 +
                availabilityScore * 0.15;

            return {
                ...book,
                recommendationScore: Math.round(score * 100)
            };
        })
        .sort((a, b) =>
            b.recommendationScore - a.recommendationScore ||
            b.borrowCount - a.borrowCount
        )
        .slice(0, limit);
};

export const getBestMemberForRecommendations = (members) => {
    return [...members].sort((a, b) => b.activeLoans - a.activeLoans)[0] || null;
};

export const getExpiryAlerts = (borrowRecords) => {
    return borrowRecords
        .filter(record => record.status === 'BORROWED')
        .map(record => ({
            record,
            ...getSmartExpiryStatus(record)
        }))
        .filter(item => item.risk === 'HIGH' || item.risk === 'MEDIUM');
};
