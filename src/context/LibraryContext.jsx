import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { initialBooks, initialMembers, initialBorrowRecords } from '../services/mockData';
import { calculateFine, generateId } from '../services/utils';
import { BookDoublyLinkedList } from '../services/dataStructures/DoublyLinkedList';
import { CircularMemberLinkedList } from '../services/dataStructures/CircularLinkedList';
import { BorrowQueue, ReturnQueue } from '../services/dataStructures/Queue';
import { BookBST, searchBooksByText } from '../services/dataStructures/BST';

const LibraryContext = createContext();

export const useLibrary = () => useContext(LibraryContext);

const buildBookStructures = (bookArray) => {
    const list = new BookDoublyLinkedList();
    const bst = new BookBST();

    bookArray.forEach(book => {
        list.append(book);
        bst.insert(book);
    });

    return { list, bst };
};

const buildMemberList = (memberArray) => {
    const list = new CircularMemberLinkedList();
    memberArray.forEach(member => list.append(member));
    return list;
};

export const LibraryProvider = ({ children }) => {
    const bookList = useRef(new BookDoublyLinkedList());
    const memberList = useRef(new CircularMemberLinkedList());
    const borrowQueue = useRef(new BorrowQueue());
    const returnQueue = useRef(new ReturnQueue());
    const bookBST = useRef(new BookBST());

    const [books, setBooks] = useState(() => {
        const saved = localStorage.getItem('library_books');
        const data = saved ? JSON.parse(saved) : initialBooks;
        const structures = buildBookStructures(data);

        bookList.current = structures.list;
        bookBST.current = structures.bst;

        return bookList.current.toArray();
    });

    const [members, setMembers] = useState(() => {
        const saved = localStorage.getItem('library_members');
        const data = saved ? JSON.parse(saved) : initialMembers;

        memberList.current = buildMemberList(data);
        return memberList.current.toArray();
    });

    const [borrowRecords, setBorrowRecords] = useState(() => {
        const saved = localStorage.getItem('library_records');
        return saved ? JSON.parse(saved) : initialBorrowRecords;
    });

    const [borrowQueueItems, setBorrowQueueItems] = useState([]);
    const [returnQueueItems, setReturnQueueItems] = useState([]);

    useEffect(() => {
        localStorage.setItem('library_books', JSON.stringify(books));
        localStorage.setItem('library_members', JSON.stringify(members));
        localStorage.setItem('library_records', JSON.stringify(borrowRecords));
    }, [books, members, borrowRecords]);

    const recordsWithFines = borrowRecords.map(record => ({
        ...record,
        fine: calculateFine(record)
    }));

    const syncBooks = () => {
        setBooks(bookList.current.toArray());
    };

    const syncMembers = () => {
        setMembers(memberList.current.toArray());
    };

    // ---------------- BOOKS: DOUBLY LINKED LIST + BST ----------------

    const addBook = (bookData) => {
        const newBook = {
            ...bookData,
            id: generateId('BOK'),
            quantity: Number(bookData.quantity) || 1,
            year: Number(bookData.year) || new Date().getFullYear(),
            availableCopies: Number(bookData.quantity) || 1,
            borrowCount: 0
        };

        bookList.current.append(newBook);
        bookBST.current.insert(newBook);
        syncBooks();
    };

    const updateBook = (bookId, updater) => {
        const updated = bookList.current.update(
            book => book.id === bookId,
            updater
        );

        if (updated) {
            bookBST.current.insert(updated);
            syncBooks();
        }

        return updated;
    };

    const searchBook = (query) => {
        if (!query) return bookList.current.toArray();

        const trimmed = String(query).trim();

        // BST search for exact book ID.
        if (/^BOK-\d+$/i.test(trimmed)) {
            const found = bookBST.current.search(trimmed);
            return found ? [found] : [];
        }

        // Text search over title/author/ISBN/genre.
        return searchBooksByText(bookList.current.toArray(), trimmed);
    };

    const getBookById = (bookId) => {
        return bookBST.current.search(bookId);
    };

    // ---------------- MEMBERS: DOUBLY LINKED LIST ----------------

    const addMember = (memberData) => {
        const newMember = {
            ...memberData,
            id: generateId('MEM'),
            registeredDate: new Date().toISOString(),
            activeLoans: 0
        };

        memberList.current.append(newMember);
        syncMembers();
    };

    const getMemberById = (memberId) => {
        return memberList.current.findById(memberId);
    };

    // ---------------- BORROW / RETURN QUEUES ----------------

    const refreshBorrowQueue = () => {
        setBorrowQueueItems(borrowQueue.current.toArray());
    };

    const refreshReturnQueue = () => {
        setReturnQueueItems(returnQueue.current.toArray());
    };

    const enqueueBorrow = (bookId, memberId) => {
        const book = getBookById(bookId);
        const member = getMemberById(memberId);

        if (!book || book.availableCopies <= 0) {
            return { success: false, message: 'Book not available.' };
        }

        if (!member) {
            return { success: false, message: 'Member not found.' };
        }

        const request = {
            id: generateId('BRQ'),
            bookId,
            memberId,
            requestedAt: new Date().toISOString(),
            type: 'BORROW'
        };

        borrowQueue.current.enqueue(request);
        refreshBorrowQueue();

        return {
            success: true,
            message: 'Borrow request added to FIFO queue.',
            request
        };
    };

    const processNextBorrow = () => {
        const request = borrowQueue.current.peek();

        if (!request) {
            return { success: false, message: 'Borrow queue is empty.' };
        }

        const book = getBookById(request.bookId);
        const member = getMemberById(request.memberId);

        if (!book || book.availableCopies <= 0) {
            borrowQueue.current.dequeue();
            refreshBorrowQueue();
            return { success: false, message: 'Front borrow request failed: book unavailable.' };
        }

        if (!member) {
            borrowQueue.current.dequeue();
            refreshBorrowQueue();
            return { success: false, message: 'Front borrow request failed: member not found.' };
        }

        const newRecord = {
            id: generateId('REC'),
            bookId: request.bookId,
            memberId: request.memberId,
            borrowDate: new Date().toISOString(),
            returnDate: null,
            fine: 0,
            status: 'BORROWED'
        };

        setBorrowRecords(prev => [...prev, newRecord]);

        updateBook(request.bookId, current => ({
            ...current,
            availableCopies: current.availableCopies - 1
        }));

        memberList.current.update(
            m => m.id === request.memberId,
            current => ({ ...current, activeLoans: current.activeLoans + 1 })
        );
        syncMembers();

        borrowQueue.current.dequeue();
        refreshBorrowQueue();

        return {
            success: true,
            message: 'Front borrow request processed successfully.',
            record: newRecord
        };
    };

    const enqueueReturn = (recordId) => {
        const record = borrowRecords.find(r => r.id === recordId);

        if (!record || record.status === 'RETURNED') {
            return { success: false, message: 'Invalid active loan.' };
        }

        const alreadyQueued = returnQueue.current
            .toArray()
            .some(request => request.recordId === recordId);

        if (alreadyQueued) {
            return { success: false, message: 'This return is already in the queue.' };
        }

        const request = {
            id: generateId('RTQ'),
            recordId,
            requestedAt: new Date().toISOString(),
            type: 'RETURN'
        };

        returnQueue.current.enqueue(request);
        refreshReturnQueue();

        return {
            success: true,
            message: 'Return request added to FIFO queue.',
            request
        };
    };

    const processNextReturn = () => {
        const request = returnQueue.current.peek();

        if (!request) {
            return { success: false, message: 'Return queue is empty.' };
        }

        const record = borrowRecords.find(r => r.id === request.recordId);

        if (!record || record.status === 'RETURNED') {
            returnQueue.current.dequeue();
            refreshReturnQueue();
            return { success: false, message: 'Front return request is no longer valid.' };
        }

        const returnDate = new Date().toISOString();
        const finalFine = calculateFine({ ...record, returnDate });

        setBorrowRecords(prev => prev.map(r =>
            r.id === request.recordId
                ? { ...r, returnDate, fine: finalFine, status: 'RETURNED' }
                : r
        ));

        updateBook(record.bookId, current => ({
            ...current,
            availableCopies: current.availableCopies + 1,
            borrowCount: (current.borrowCount || 0) + 1
        }));

        memberList.current.update(
            m => m.id === record.memberId,
            current => ({
                ...current,
                activeLoans: Math.max(0, current.activeLoans - 1)
            })
        );
        syncMembers();

        returnQueue.current.dequeue();
        refreshReturnQueue();

        return {
            success: true,
            message: `Front return request processed. Fine: Rs. ${finalFine}`,
            fine: finalFine
        };
    };

    // Existing callers still work: request is put in the FIFO queue and
    // the first request is processed immediately.
    const borrowBook = (bookId, memberId) => {
        const queued = enqueueBorrow(bookId, memberId);
        if (!queued.success) return queued;
        return processNextBorrow();
    };

    const returnBook = (recordId) => {
        const queued = enqueueReturn(recordId);
        if (!queued.success) return queued;
        return processNextReturn();
    };

    return (
        <LibraryContext.Provider
            value={{
                books,
                members,
                borrowRecords: recordsWithFines,
                borrowQueue: borrowQueueItems,
                returnQueue: returnQueueItems,
                enqueueBorrow,
                processNextBorrow,
                enqueueReturn,
                processNextReturn,
                addBook,
                updateBook,
                searchBook,
                getBookById,
                addMember,
                getMemberById,
                borrowBook,
                returnBook
            }}
        >
            {children}
        </LibraryContext.Provider>
    );
};
