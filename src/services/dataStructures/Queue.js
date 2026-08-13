/*
 * FIFO Queue for Borrow and Return operations.
 * enqueue -> rear
 * dequeue -> front
 */

class QueueNode {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

export class Queue {
    constructor() {
        this.front = null;
        this.rear = null;
        this.length = 0;
    }

    enqueue(data) {
        const node = new QueueNode(data);

        if (!this.rear) {
            this.front = node;
            this.rear = node;
        } else {
            this.rear.next = node;
            this.rear = node;
        }

        this.length++;
        return data;
    }

    dequeue() {
        if (!this.front) return null;

        const data = this.front.data;
        this.front = this.front.next;

        if (!this.front) this.rear = null;

        this.length--;
        return data;
    }

    peek() {
        return this.front ? this.front.data : null;
    }

    isEmpty() {
        return this.front === null;
    }

    toArray() {
        const result = [];
        let current = this.front;

        while (current) {
            result.push(current.data);
            current = current.next;
        }

        return result;
    }

    clear() {
        this.front = null;
        this.rear = null;
        this.length = 0;
    }

    get size() {
        return this.length;
    }
}

export class BorrowQueue extends Queue {}
export class ReturnQueue extends Queue {}
