export const initialBooks = [
    { id: 'BOK-001', isbn: 'ISBN-001', title: 'Clean Code', author: 'Robert C. Martin', genre: 'Technology', year: 2008, quantity: 3, availableCopies: 2, borrowCount: 2 },
    { id: 'BOK-002', isbn: 'ISBN-002', title: 'The Pragmatic Programmer', author: 'David Thomas', genre: 'Technology', year: 2019, quantity: 2, availableCopies: 1, borrowCount: 0 },
    { id: 'BOK-003', isbn: 'ISBN-003', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', genre: 'Computer Science', year: 2009, quantity: 4, availableCopies: 4, borrowCount: 3 },
    { id: 'BOK-004', isbn: 'ISBN-004', title: 'Design Patterns', author: 'Gang of Four', genre: 'Technology', year: 1994, quantity: 2, availableCopies: 1, borrowCount: 0 },
    { id: 'BOK-005', isbn: 'ISBN-005', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Fiction', year: 1925, quantity: 5, availableCopies: 5, borrowCount: 1 },
    { id: 'BOK-006', isbn: 'ISBN-006', title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', year: 1960, quantity: 3, availableCopies: 3, borrowCount: 0 },
    { id: 'BOK-007', isbn: 'ISBN-007', title: '1984', author: 'George Orwell', genre: 'Fiction', year: 1949, quantity: 4, availableCopies: 4, borrowCount: 3 },
    { id: 'BOK-008', isbn: 'ISBN-008', title: 'A Brief History of Time', author: 'Stephen Hawking', genre: 'Science', year: 1988, quantity: 2, availableCopies: 1, borrowCount: 0 },
    { id: 'BOK-009', isbn: 'ISBN-009', title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'History', year: 2011, quantity: 3, availableCopies: 3, borrowCount: 1 },
    { id: 'BOK-010', isbn: 'ISBN-010', title: 'Refactoring', author: 'Martin Fowler', genre: 'Technology', year: 2018, quantity: 2, availableCopies: 2, borrowCount: 0 },
    { id: 'BOK-011', isbn: 'ISBN-011', title: 'The Hitchhiker\'s Guide to the Galaxy', author: 'Douglas Adams', genre: 'Fiction', year: 1979, quantity: 3, availableCopies: 3, borrowCount: 0 },
    { id: 'BOK-012', isbn: 'ISBN-012', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', genre: 'Science', year: 2011, quantity: 2, availableCopies: 2, borrowCount: 0 },
];

const now = new Date();
const subtractDays = (d, days) => new Date(d.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

export const initialMembers = [
    { id: 'MEM-001', name: 'Kavindu Perera', email: 'kavindu@email.com', phone: '077-1234567', registeredDate: subtractDays(now, 180), activeLoans: 1 },
    { id: 'MEM-002', name: 'Sanduni Jayawardena', email: 'sanduni@email.com', phone: '071-9876543', registeredDate: subtractDays(now, 120), activeLoans: 1 },
    { id: 'MEM-003', name: 'Thilina Silva', email: 'thilina@email.com', phone: '076-5554444', registeredDate: subtractDays(now, 90), activeLoans: 1 },
    { id: 'MEM-004', name: 'Nimasha Bandara', email: 'nimasha@email.com', phone: '070-3332222', registeredDate: subtractDays(now, 60), activeLoans: 0 },
    { id: 'MEM-005', name: 'Ravindu Wijesinghe', email: 'ravindu@email.com', phone: '072-7778888', registeredDate: subtractDays(now, 30), activeLoans: 0 },
];

export const initialBorrowRecords = [
    { id: 'REC-001', bookId: 'BOK-001', memberId: 'MEM-001', borrowDate: subtractDays(now, 60), returnDate: subtractDays(now, 45), fine: 0, status: 'RETURNED' },
    { id: 'REC-002', bookId: 'BOK-001', memberId: 'MEM-002', borrowDate: subtractDays(now, 50), returnDate: subtractDays(now, 30), fine: 0, status: 'RETURNED' },
    { id: 'REC-003', bookId: 'BOK-003', memberId: 'MEM-003', borrowDate: subtractDays(now, 45), returnDate: subtractDays(now, 28), fine: 0, status: 'RETURNED' },
    { id: 'REC-004', bookId: 'BOK-003', memberId: 'MEM-001', borrowDate: subtractDays(now, 30), returnDate: subtractDays(now, 15), fine: 0, status: 'RETURNED' },
    { id: 'REC-005', bookId: 'BOK-007', memberId: 'MEM-004', borrowDate: subtractDays(now, 40), returnDate: subtractDays(now, 20), fine: 0, status: 'RETURNED' },
    { id: 'REC-006', bookId: 'BOK-007', memberId: 'MEM-002', borrowDate: subtractDays(now, 35), returnDate: subtractDays(now, 10), fine: 0, status: 'RETURNED' },
    { id: 'REC-007', bookId: 'BOK-007', memberId: 'MEM-005', borrowDate: subtractDays(now, 25), returnDate: subtractDays(now, 5), fine: 0, status: 'RETURNED' },
    { id: 'REC-008', bookId: 'BOK-009', memberId: 'MEM-003', borrowDate: subtractDays(now, 55), returnDate: subtractDays(now, 40), fine: 0, status: 'RETURNED' },
    { id: 'REC-009', bookId: 'BOK-005', memberId: 'MEM-004', borrowDate: subtractDays(now, 20), returnDate: subtractDays(now, 4), fine: 0, status: 'RETURNED' },

    // Active loans
    { id: 'REC-010', bookId: 'BOK-002', memberId: 'MEM-001', borrowDate: subtractDays(now, 5), returnDate: null, fine: 0, status: 'BORROWED' },
    { id: 'REC-011', bookId: 'BOK-004', memberId: 'MEM-002', borrowDate: subtractDays(now, 30), returnDate: null, fine: 0, status: 'BORROWED' }, // Overdue
    { id: 'REC-012', bookId: 'BOK-008', memberId: 'MEM-003', borrowDate: subtractDays(now, 20), returnDate: null, fine: 0, status: 'BORROWED' }, // Overdue
];
