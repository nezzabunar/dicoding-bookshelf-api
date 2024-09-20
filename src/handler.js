const { nanoid } = require('nanoid');
const books = require('./books');

const getAllBooks = (req, h) => {
    const { name, reading, finished } = req.query;
    let filterBooks = books;

    if (name) {
        const nameToLowerCase = name.toLowerCase();
        filterBooks = filterBooks.filter((book) =>
            book.name.toLowerCase().includes(nameToLowerCase)
        )
    };

    if (reading) {
        if (reading === '0') {
            filterBooks = filterBooks.filter((book) => book.reading === false);
        } else {
            filterBooks = filterBooks.filter((book) => book.reading === true);
        }
    };

    if (finished) {
        if (finished === '0') {
            filterBooks = filterBooks.filter((book) => book.finished === false);
        } else {
            filterBooks = filterBooks.filter((book) => book.finished === true);
        }
    };
    
    // Maping array books before refactor

    // const result = filterBooks.map((book) => ({
    //     id: book.id,
    //     name: book.name,
    //     publisher: book.publisher,
    // }))

    const result = filteredBooks.map(({ id, name, publisher }) => ({ id, name, publisher }))

    const response = h.response({
        status: 'success',
        data: {
            books: result,
        }
    });
    response.code(200);
    return response;
};

const addBookHandler = (req, h) => {
    const { name, year, author, summary, publisher,
        pageCount, readPage, reading } = req.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage ? true : false;

    const newBook = {
        id, name, year, author, summary, publisher,
        pageCount, readPage, reading, finished, insertedAt, updatedAt,
    };

    if (!name || undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    };

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    };

    books.push(newBook);
    // before refactor 
    // const isSuccess = books.filter((book) => book.id === id).length > 0;
    
    const isSuccess = books.some((book) => book.id === id);

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
    };

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(400);
    return response;
};

const getBookByIdHandler = (req, h) => {
    const { id } = req.params;
    const book = books.filter((n) => n.id === id)[0];

    if (book) {
        const response = h.response({
            status: 'success',
            data: {
                book,
            },
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

const editBookByIdHandler = (req, h) => {
    const { id } = req.params;
    const { name, year, author, summary, publisher,
        pageCount, readPage, reading } = req.payload;

    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === id);

    if (!name || undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    };

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    };

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    };

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (req, h) => {
    const { id } = req.params;
    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    };

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {
    getAllBooks,
    getBookByIdHandler,
    addBookHandler,
    editBookByIdHandler,
    deleteBookByIdHandler
}