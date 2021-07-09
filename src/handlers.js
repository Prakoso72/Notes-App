const notes = require('./notes');

const addNote = (request, h) => {
  const { title, tags, body } = request.payload;

  const id = makeID();
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const note = {
    id,
    title,
    createdAt,
    updatedAt,
    tags,
    body
  };

  notes.push(note);

  if (notes.some(note => note.id === id)) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: 'V09YExygSUYogwWJ'
      }
    })
      .code(201)
      .header('content-type', 'application/json');

    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Catatan gagal untuk ditambahkan'
  })
    .code(500)
    .header('content-type', 'application/json');

  return response;
};

const getANote = (request, h) => {
  const { id } = request.params;

  const note = notes.find(note => note.id === id);

  if (note === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Catatan tidak ditemukan'
    })
      .code(404)
      .header('content-type', 'application/json');

    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      note
    }
  })
    .code(200)
    .header('content-type', 'application/json');

  return response;
};

const getNotes = (request, h) => {
  const response = h.response({
    status: 'success',
    data: {
      notes
    }
  })
    .code(200)
    .header('content-type', 'application/json');

  return response;
};

const updateNote = (request, h) => {
  const { id } = request.params;

  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toString();

  const note = notes.find(note => note.id === id);

  if (note === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui catatan. Id catatan tidak ditemukan'
    })
      .code(404)
      .header('content-type', 'application/json');

    return response;
  }

  note.title = title;
  note.tags = tags;
  note.body = body;
  note.updatedAt = updatedAt;

  const response = h.response({
    status: 'success',
    message: 'Catatan berhasil diperbaharui'
  });

  return response;
};

const deleteNote = (request, h) => {
  const { id } = request.params;

  const indexNote = notes.findIndex(note => note.id === id);

  if (indexNote === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Catatan gagal dihapus. Id catatan tidak ditemukan'
    })
      .code(404)
      .header('content-type', 'application/json');

    return response;
  }

  notes.splice(indexNote, 1);

  const response = h.response({
    status: 'success',
    message: 'Catatan berhasil dihapus'
  });

  return response;
};

const makeID = () => {
  let id = '_' + Math.random().toString(36).substr(2, 9);
  if (notes.find(note => note.id === id) !== undefined) id = makeID();
  return id;
};

module.exports = { addNote, getANote, getNotes, updateNote, deleteNote };
