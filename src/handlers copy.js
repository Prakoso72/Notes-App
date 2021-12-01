const notes = require('./notes');
const transact = require('./transact/transact');

const addNote = (request, h) => {
  const { title, tags, body } = request.payload;

  const id = transact.addNote(title, body, tags);

  if (transact.isNoteExist(id) === 1) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id
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
    message: 'Catatan berhasil diperbarui'
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

module.exports = { addNote, getANote, getNotes, updateNote, deleteNote };
