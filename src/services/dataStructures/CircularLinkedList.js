/*
 * Circular Linked List for Members.
 * The last node always points back to the first node.
 */

class CircularNode {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

export class CircularMemberLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    append(data) {
        const node = new CircularNode(data);

        if (!this.head) {
            this.head = node;
            this.tail = node;
            node.next = node;
        } else {
            node.next = this.head;
            this.tail.next = node;
            this.tail = node;
        }

        this.length++;
        return node;
    }

    find(predicate) {
        if (!this.head) return null;

        let current = this.head;
        do {
            if (predicate(current.data)) return current.data;
            current = current.next;
        } while (current !== this.head);

        return null;
    }

    findNode(predicate) {
        if (!this.head) return null;

        let current = this.head;
        do {
            if (predicate(current.data)) return current;
            current = current.next;
        } while (current !== this.head);

        return null;
    }

    findById(id) {
        return this.find(member => member.id === id);
    }

    update(predicate, updater) {
        const node = this.findNode(predicate);
        if (!node) return null;

        node.data = updater(node.data);
        return node.data;
    }

    remove(predicate) {
        if (!this.head) return null;

        let current = this.head;
        let previous = this.tail;

        do {
            if (predicate(current.data)) {
                if (this.length === 1) {
                    this.head = null;
                    this.tail = null;
                } else {
                    previous.next = current.next;

                    if (current === this.head) {
                        this.head = current.next;
                    }

                    if (current === this.tail) {
                        this.tail = previous;
                    }

                    this.tail.next = this.head;
                }

                current.next = null;
                this.length--;
                return current.data;
            }

            previous = current;
            current = current.next;
        } while (current !== this.head);

        return null;
    }

    toArray() {
        const result = [];
        if (!this.head) return result;

        let current = this.head;

        do {
            result.push(current.data);
            current = current.next;
        } while (current !== this.head);

        return result;
    }

    forEach(callback) {
        if (!this.head) return;

        let current = this.head;
        let index = 0;

        do {
            callback(current.data, index++);
            current = current.next;
        } while (current !== this.head);
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
