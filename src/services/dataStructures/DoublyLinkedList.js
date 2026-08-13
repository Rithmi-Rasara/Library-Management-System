/*
 * Doubly Linked List
 * Used for Books and Members.
 * Each node stores previous and next references.
 */

class DoublyNode {
    constructor(data) {
        this.data = data;
        this.prev = null;
        this.next = null;
    }
}

export class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    append(data) {
        const node = new DoublyNode(data);

        if (!this.head) {
            this.head = node;
            this.tail = node;
        } else {
            node.prev = this.tail;
            this.tail.next = node;
            this.tail = node;
        }

        this.length++;
        return node;
    }

    prepend(data) {
        const node = new DoublyNode(data);

        if (!this.head) {
            this.head = node;
            this.tail = node;
        } else {
            node.next = this.head;
            this.head.prev = node;
            this.head = node;
        }

        this.length++;
        return node;
    }

    find(predicate) {
        let current = this.head;

        while (current) {
            if (predicate(current.data)) return current.data;
            current = current.next;
        }

        return null;
    }

    findNode(predicate) {
        let current = this.head;

        while (current) {
            if (predicate(current.data)) return current;
            current = current.next;
        }

        return null;
    }

    update(predicate, updater) {
        const node = this.findNode(predicate);
        if (!node) return null;

        node.data = updater(node.data);
        return node.data;
    }

    remove(predicate) {
        const node = this.findNode(predicate);
        if (!node) return null;

        if (node.prev) {
            node.prev.next = node.next;
        } else {
            this.head = node.next;
        }

        if (node.next) {
            node.next.prev = node.prev;
        } else {
            this.tail = node.prev;
        }

        node.prev = null;
        node.next = null;
        this.length--;

        return node.data;
    }

    toArray() {
        const result = [];
        let current = this.head;

        while (current) {
            result.push(current.data);
            current = current.next;
        }

        return result;
    }

    toReverseArray() {
        const result = [];
        let current = this.tail;

        while (current) {
            result.push(current.data);
            current = current.prev;
        }

        return result;
    }

    clear() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    get size() {
        return this.length;
    }
}

export class BookDoublyLinkedList extends DoublyLinkedList {
    findById(id) {
        return this.find(book => book.id === id);
    }
}

