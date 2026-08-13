/*
 * Binary Search Tree for Book Searching.
 * AVL is intentionally NOT used.
 *
 * Key: normalized Book ID.
 * Search by ID is O(h), where h is the BST height.
 */

class BSTNode {
    constructor(book) {
        this.book = book;
        this.left = null;
        this.right = null;
    }
}

export class BookBST {
    constructor() {
        this.root = null;
        this.size = 0;
    }

    compare(a, b) {
        return a.localeCompare(b);
    }

    insert(book) {
        const key = String(book.id).toUpperCase();

        if (!this.root) {
            this.root = new BSTNode(book);
            this.size++;
            return;
        }

        let current = this.root;

        while (true) {
            const currentKey = String(current.book.id).toUpperCase();
            const comparison = this.compare(key, currentKey);

            if (comparison === 0) {
                current.book = book;
                return;
            }

            if (comparison < 0) {
                if (!current.left) {
                    current.left = new BSTNode(book);
                    this.size++;
                    return;
                }
                current = current.left;
            } else {
                if (!current.right) {
                    current.right = new BSTNode(book);
                    this.size++;
                    return;
                }
                current = current.right;
            }
        }
    }

    search(id) {
        const key = String(id).toUpperCase();
        let current = this.root;

        while (current) {
            const currentKey = String(current.book.id).toUpperCase();

            if (key === currentKey) return current.book;

            current = this.compare(key, currentKey) < 0
                ? current.left
                : current.right;
        }

        return null;
    }

    inOrder(callback) {
        const walk = (node) => {
            if (!node) return;
            walk(node.left);
            callback(node.book);
            walk(node.right);
        };

        walk(this.root);
    }

    toArray() {
        const result = [];
        this.inOrder(book => result.push(book));
        return result;
    }

    clear() {
        this.root = null;
        this.size = 0;
    }
}

/*
 * Text search still needs to inspect book fields, so it is O(n).
 * The BST is used specifically for fast ID lookup.
 */
export const searchBooksByText = (books, query) => {
    const q = String(query || '').trim().toLowerCase();

    if (!q) return books;

    return books.filter(book =>
        String(book.id).toLowerCase().includes(q) ||
        String(book.title).toLowerCase().includes(q) ||
        String(book.author).toLowerCase().includes(q) ||
        String(book.isbn).toLowerCase().includes(q) ||
        String(book.genre).toLowerCase().includes(q)
    );
};
