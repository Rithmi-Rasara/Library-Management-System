## Smart Library Management System

A web-based Smart Library Management System developed using React and JavaScript. The project demonstrates how fundamental data structures and algorithms can be applied to a real-world library management problem.

📌 ## Project Overview

The system helps manage:

Books

Library members

Borrowing requests

Return requests

Active loans

Book availability

Due-date monitoring

Fine prediction

Smart book recommendations

The application runs in the browser and uses Local Storage to persist library data.

✨ ## Main Features

📚 Book Management

Add new books

Update book information

Search books

Search by Book ID, title, author, ISBN, or genre

Track total and available copies

Track borrowing count

👥 ## Member Management

Register library members

Store member information

Track registration date

Track active loans

Search and manage members

🔄 ## Borrow & Return Management

Add borrowing requests to a FIFO queue

Process the oldest borrowing request first

Add return requests to a FIFO queue

Process the oldest return request first

Automatically update book availability

Automatically update member active-loan count

🤖 ## Smart Features

Smart Recommendation – recommends books using borrowing history, preferred genres, popularity, and availability.

Smart Expiry – identifies loans as ON_TRACK, DUE_SOON, or OVERDUE.

Fine Prediction – estimates a future fine based on overdue days.
