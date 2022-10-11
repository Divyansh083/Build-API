let books = [
  {
    ISBN: "12345Book",
    title: "Getting Started With MERN",
    pubDate: "2021-07-09",
    language: "en",
    numPage: 250,
    author: [1, 2],
    publication: [1],
    category: ["tech", "programming", "education", "thriller"],
  },
  {
    ISBN: "Marvel",
    title: "Dhoni The Untold Story",
    pubDate: "2002-09-15",
    language: "en",
    numPage: 150,
    author: [1, 2],
    publication: [1],
    category: ["sports", "education", "thriller"],
  },
];

const author = [
  {
    id: 1,
    name: "Divyansh",
    books: ["12345Book", "1234567Secret"],
  },
  {
    id: 2,
    name: "Elon Musk",
    books: ["12345Book"],
  },
];

const publication = [
  {
    id: 1,
    name: "writeX",
    books: ["12345Book"],
  },
  {
    id: 2,
    name: "Priya",
    books: ["1234567Secret"],
  },
];

module.exports = { books, author, publication };
