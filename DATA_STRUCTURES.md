# Data Structures

### Books
- Doubly Linked List: `src/services/dataStructures/DoublyLinkedList.js`
- BST: `src/services/dataStructures/BST.js`
- Exact Book ID searches use BST.
- AVL Tree is not used.

### Members
- Circular Linked List: `src/services/dataStructures/CircularLinkedList.js`
- `tail.next` points back to `head`.
- Supports append, find, update, remove and circular traversal.

### Borrow
- FIFO Queue: `src/services/dataStructures/Queue.js`
- `BorrowQueue` stores borrow requests.
- `enqueue()` adds to rear.
- `dequeue()` processes the front request first.

### Return
- FIFO Queue: `ReturnQueue`
- Return requests are also processed in FIFO order.

### Smart Features
- Recommendation
- Smart expiry detection
- Fine prediction

The React UI shows the actual Borrow Queue and Return Queue in the Circulation Desk.
