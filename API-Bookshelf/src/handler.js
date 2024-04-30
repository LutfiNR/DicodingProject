/* eslint-disable import/no-extraneous-dependencies */
const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (name === '' || name == null || readPage > pageCount) {
    const failText = (readPage > pageCount) ? 'readPage tidak boleh lebih besar dari pageCount' : 'Mohon isi nama buku';
    const response = h.response({
      status: 'fail',
      message: `Gagal menambahkan buku. ${failText}`,
    });
    response.code(400);
    return response;
  }
  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBookHandler = (request, h) => {
  const { name: searchName, reading: isReading, finished: isFinished } = request.query;
  const isNotEmpty = books.length > 0;

  const filterByName = () => {
    const filteredBooks = books
      .filter((book) => book.name.toLowerCase().includes(searchName.toLowerCase()))
      .map(({ id, name, publisher }) => ({ id, name, publisher }));

    return filteredBooks;
  };
  const filterByReading = () => {
    const filteredBooks = books
      .filter((book) => (isReading === '1' ? book.reading === true : book.reading === false))
      .map(({ id, name, publisher }) => ({ id, name, publisher }));

    return filteredBooks;
  };
  const filterByFinished = () => {
    const filteredBooks = books
      .filter((book) => (isFinished === '1' ? book.finished === true : book.finished === false))
      .map(({ id, name, publisher }) => ({ id, name, publisher }));

    return filteredBooks;
  };

  if (isNotEmpty) {
    if (searchName) {
      const dataResponse = filterByName();
      const response = h.response({
        status: 'success',
        data: {
          books: dataResponse,
        },
      });
      return response;
    }
    if (isReading) {
      const dataResponse = filterByReading();
      const response = h.response({
        status: 'success',
        data: {
          books: dataResponse,
        },
      });
      return response;
    }
    if (isFinished) {
      const dataResponse = filterByFinished();
      const response = h.response({
        status: 'success',
        data: {
          books: dataResponse,
        },
      });
      return response;
    }
    const dataResponse = books.map(({ id, name, publisher }) => ({ id, name, publisher }));
    const response = h.response({
      status: 'success',
      data: {
        books: dataResponse,
      },
    });
    return response;
  }
  const response = h.response({
    status: 'success',
    data: {
      books,
    },
  });
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((b) => b.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    if (name === '' || name == null || readPage > pageCount) {
      const failText = (readPage > pageCount) ? 'readPage tidak boleh lebih besar dari pageCount' : 'Mohon isi nama buku';
      const response = h.response({
        status: 'fail',
        message: `Gagal memperbarui buku. ${failText}`,
      });
      response.code(400);
      return response;
    }

    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler, getAllBookHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler,
};
