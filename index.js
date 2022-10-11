require("dotenv").config();

//Framework
const express = require("express");
const mongoose = require("mongoose");

//Database
const database = require("./database/database");

//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

//Inititalization
const booky = express();

//Configaration
booky.use(express.json());

//Establish the database connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connection Established"));

/*
Route:  /
Description: get all books
Access: public
Parameter: NO
Method: GET
*/
booky.get("/", async (req, res) => {
  const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
});

/*
Route:  /is
Description: get all books based on ISBN
Access: public
Parameter: isbn
Method: GET
*/
booky.get("/is/:isbn", async (req, res) => {
  const getSpecificBook = await BookModel.findOne({ ISBN: req.params.isbn });

  // const getSpecificBook = database.books.filter(
  //   (book) => book.ISBN === req.params.isbn
  // );

  if (!getSpecificBook) {
    return res.json({ error: `No Book Found For the ISBN ${req.params.isbn}` });
  }

  return res.json({ book: getSpecificBook });
});

/*
Route:  /c
Description: get all books based on category
Access: public
Parameter: category
Method: GET
*/
booky.get("/c/:category", async (req, res) => {
  const getSpecificBook = await BookModel.findOne({
    category: req.params.category,
  });

  // const getSpecificBook = database.books.filter((book) =>
  //   book.category.includes(req.params.category)
  // );

  if (!getSpecificBook) {
    return res.json({
      error: `No Book Found For the Category ${req.params.category}`,
    });
  }

  return res.json({ book: getSpecificBook });
});

/*
Route:  /l
Description: get all books based on language
Access: public
Parameter: language
Method: GET
*/
booky.get("/l/:language", (req, res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.language === req.params.language
  );

  if (getSpecificBook.length == 0) {
    return res.json({
      error: `No Book Found For the Language ${req.params.language}`,
    });
  }

  return res.json({ book: getSpecificBook });
});

/*
Route:  /author
Description: get all author
Access: public
Parameter: NONE
Method: GET
*/
booky.get("/author", async (req, res) => {
  const getAllAuthor = await AuthorModel.find();

  return res.json({ author: getAllAuthor });
});

/*
Route:  /author
Description: get all author based on ID
Access: public
Parameter: id
Method: GET
*/
booky.get("/author/:id", (req, res) => {
  const getSpecificAuthor = database.author.filter(
    (authors) => authors.id == req.params.id
  );

  if (getSpecificAuthor == 0) {
    return res.json({ error: `No Author Found Of ID ${req.params.id}` });
  }

  return res.json({ author: getSpecificAuthor });
});

/*
Route:  /author
Description: get all author based on Books
Access: public
Parameter: id
Method: GET
*/
booky.get("/author/b/:isbn", (req, res) => {
  const getSpecificAuthor = database.author.filter((author) =>
    author.books.includes(req.params.isbn)
  );

  if (getSpecificAuthor == 0) {
    return res.json({ error: `No Author Found For Book of${req.params.isbn}` });
  }

  return res.json({ author: getSpecificAuthor });
});

/*
Route:  /publication
Description: get all publication
Access: public
Parameter: NONE
Method: GET
*/
booky.get("/publication", (req, res) => {
  return res.json({ publication: database.publication });
});

/*
  Route:  /publication
  Description: get publication based on ID
  Access: public
  Parameter: id
  Method: GET
  */
booky.get("/publication/:id", (req, res) => {
  const getSpecificPublication = database.publication.filter(
    (publication) => publication.id == req.params.id
  );

  if (getSpecificPublication == 0) {
    return res.json({ error: `No Publication Found Of ID ${req.params.id}` });
  }

  return res.json({ publication: getSpecificPublication });
});

/*
  Route:  /author
  Description: to get list of publication based on book 
  Access: public
  Parameter: id
  Method: GET
  */
booky.get("/publication/b/:isbn", (req, res) => {
  const getSpecificPublication = database.publication.filter((publication) =>
    publication.books.includes(req.params.isbn)
  );

  if (getSpecificPublication == 0) {
    return res.json({
      error: `No Publication Found For Book of${req.params.isbn}`,
    });
  }

  return res.json({ publication: getSpecificPublication });
});

//!----------------------------------POST--------------------------------------------------------------------------
/*
  Route:  /book/add
  Description: add new Book 
  Access: public
  Parameter: NONE
  Method:  POST
  */
booky.post("/book/add", (req, res) => {
  const { newBook } = req.body;

  const addNewBook = BookModel.create(newBook);
  // database.books.push(newBook);
  return res.json({ books: database.books });
});

/*
  Route:  /author/add
  Description: add new author 
  Access: public
  Parameter: NONE
  Method:  POST
  */
booky.post("/author/add", (req, res) => {
  const { newAuthor } = req.body;

  const addNewAuthor = AuthorModel.create(newAuthor);

  // database.author.push(newAuthor);
  return res.json({ books: database.author });
});

/*
  Route:  /publication/add
  Description: add new publication
  Access: public
  Parameter: NONE
  Method:  POST
  */
booky.post("/publication/add", (req, res) => {
  const { newPublication } = req.body;

  const addNewPublication = PublicationModel.create(newPublication);

  // database.publication.push(newPubication);
  return res.json({ books: database.publication });
});

//!.............................................PUT..............................................................
/*
  Route:  /book/update/title
  Description:  Update Book Title
  Access: public
  Parameter: NONE
  Method:  PUT
  */
booky.put("/book/update/title/:isbn", async (req, res) => {
  const updateBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      title: req.body.newBookTitle,
    },
    {
      new: true,
    }
  );
  return res.json({ books: updateBook });
  // database.books.forEach((book) => {
  //   if (book.ISBN === req.params.isbn) {
  //     book.title = req.body.newBookTitle; //.body means ke apne postman me declare kiya hee yaa body define ke hee
  //     return;
  //   }
  // });
});

/*
  Route:  /book/update/author
  Description:  update/add new author for a book
  Access: public
  Parameter: isbn,authorID
  Method:  PUT
  */

booky.put("/book/update/author/:isbn", async (req, res) => {
  const updateBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      $addToSet: {
        author: req.body.newAuthor,
      },
    },
    {
      new: true,
    }
  );

  const updateAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: req.body.newAuthor,
    },
    {
      $addToSet: {
        books: req.params.isbn,
      },
    },
    {
      new: true,
    }
  );

  /*
    update Book Database
    database.books.forEach((book) => {
      if (book.ISBN === req.params.isbn) {
        return book.author.push(parseInt(req.params.authorID));
      }
    });

    update Author Database

    database.author.forEach((author) => {
      if (author.id === parseInt(req.params.authorID)) {
        return author.books.push(req.params.isbn);
      }
    });
    */
  return res.json({ books: updateBook, author: updateAuthor });
});

/*
  Route:  /book/update/author
  Description:  Update Author name using it's id
  Access: public
  Parameter: id
  Method:  PUT
  */
booky.put("/book/update/author/:id", (req, res) => {
  database.author.forEach((authors) => {
    if (authors.id === parseInt(req.params.id)) {
      authors.name = req.body.newAuthorTitle;
    }
  });

  return res.json({ author: database.author });
});

/*
  Route:  /book/update/publication
  Description:  Update the publication name using it's id
  Access: public
  Parameter: id
  Method:  PUT
  */
booky.put("/book/update/publication/:id", (req, res) => {
  database.publication.forEach((publication) => {
    if (publication.id === parseInt(req.params.id)) {
      publication.name = req.body.newPubicationName;
    }
  });

  return res.json({ publication: database.publication });
});

/*
  Route:  /publication/update/book
  Description:  update/add books to publications
  Access: public
  Parameter: id
  Method:  PUT
  */
booky.put("/publication/update/book/:isbn", (req, res) => {
  //Update publicatio Database
  database.publication.forEach((publication) => {
    if (publication.id === req.body.pubID) {
      return publication.books.push(req.params.isbn);
    }
  });

  //Update The Book Database
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      book.publication = req.body.pubID;
      return;
    }
  });

  return res.json({
    books: database.books,
    publications: database.publication,
  });
});

//!................................................DELETE...............................

/*
  Route:  /book/delete
  Description:  delete a book
  Access: public
  Parameter: isbn
  Method:  DELETE
  */
booky.delete("/book/delete/:isbn", async (req, res) => {
  const updatedBookDatabase = await BookModel.findOneAndDelete({
    ISBN: req.params.isbn,
  });

  /*
  const updatedBookDatabase = database.books.filter((book) => {
    book.ISBN !== req.params.isbn;
  });

  database.books = updatedBookDatabase;
  */
  return res.json({ book: database.books });
});

/*
  Route:  /book/delete/author
  Description:  delete a author from a book
  Access: public
  Parameter: isbn, authorId
  Method:  DELETE
  */
booky.delete("/book/delete/author/:isbn/:authorId", async (req, res) => {
  //update the book database
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      $pull: {
        author: parseInt(req.params.authorId),
      },
    },
    {
      new: true,
    }
  );
  /*
  database.books.forEach((book) => {
    if (book.ISBN === req.params.isbn) {
      const newAuthorList = book.author.filter((author) => {
        author !== parseInt(req.params.authorId);
      });
      book.author = newAuthorList;
      return;
    }
  });
  */

  //Update the author database
  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: parseInt(req.params.authorId),
    },
    {
      $pull: {
        books: req.params.isbn,
      },
    },
    {
      new: true,
    }
  );
  /*
  database.author.forEach((author) => {
    if (author.id === parseInt(req.params.authorId)) {
      const newBookList = author.books.filter(
        (book) => book !== req.params.isbn
      );
      author.books = newBookList;
      return;
    }
  });
  */
  res.json({ book: updatedBook, author: updatedAuthor });
});

booky.listen(3000, () => console.log("Hey,Server Is Running"));
