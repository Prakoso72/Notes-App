const Note = require('./notes');
const transact = require('./transact/transact');

const addNote = async (request, h) => {
  const { title, tags, body } = request.payload;

  let response;

  const id = await transact.addNote(title, body, tags);

  if (id !== -1) {
    response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id
      }
    })
      .code(201)
      .header('content-type', 'application/json');
  } else {
    response = h.response({
      status: 'error',
      message: 'Catatan gagal untuk ditambahkan'
    })
      .code(500)
      .header('content-type', 'application/json');
  }

  return response;
};

const getANote = async (request, h) => {
  const { id } = request.params;

  let response;

  const transactNote = await transact.getANote(id);
  const note = new Note(transactNote).getNote();

  if (note === undefined) {
    response = h.response({
      status: 'fail',
      message: 'Catatan tidak ditemukan'
    })
      .code(404)
      .header('content-type', 'application/json');
  } else if (note === -1) {
    response = h.response({
      status: 'Error',
      message: 'Server Error'
    })
      .code(500)
      .header('content-type', 'application/json');
  } else {
    response = h.response({
      status: 'success',
      data: {
        note
      }
    })
      .code(200)
      .header('content-type', 'application/json');
  }

  return response;
};

const getNotes = async (request, h) => {
  let response;

  const allNote = await transact.getAllNote();

  const notes = [];
  for (let i = 0; i < allNote.length; i++) {
    if ((i + 1) === allNote.length) notes.push(allNote[i]);
    else if (allNote[i].ID === allNote[i + 1].ID) {
      allNote[i + 1].Tag = typeof (allNote[i].Tag) === 'object' ? [...allNote[i].Tag, allNote[i + 1].Tag] : [allNote[i].Tag, allNote[i + 1].Tag];
    } else notes.push(allNote[i]);
  }

  if (allNote === -1) {
    response = h.response({
      status: 'Error',
      message: 'Server Error'
    })
      .code(500)
      .header('content-type', 'application/json');
  } else {
    response = h.response({
      status: 'success',
      data: {
        notes
      }
    })
      .code(200)
      .header('content-type', 'application/json');
  }

  return response;
};

const updateNote = async (request, h) => {
  const { id } = request.params;
  const { title, tags, body } = request.payload;

  let response;

  const transactStatus = await transact.updateNote(id, title, body, tags);
  if (transactStatus === 0) {
    response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui catatan. Id catatan tidak ditemukan'
    })
      .code(404)
      .header('content-type', 'application/json');
  } else if (transactStatus === -1) {
    response = h.response({
      status: 'Error',
      message: 'Server Error'
    })
      .code(500)
      .header('content-type', 'application/json');
  } else {
    response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui'
    });
  }

  return response;
};

const deleteNote = async (request, h) => {
  const { id } = request.params;

  let response;

  const transactStatus = await transact.removeNote(id);
  if (transactStatus === -1) {
    response = h.response({
      status: 'Error',
      message: 'Server Error'
    })
      .code(500)
      .header('content-type', 'application/json');
  } else if (transactStatus === 0) {
    response = h.response({
      status: 'Fail',
      message: 'Gagal menghapus catatan. Id catatan tidak ditemukan'
    })
      .code(404)
      .header('content-type', 'application/json');
  } else {
    response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus'
    });
  }

  return response;
};

module.exports = { addNote, getANote, getNotes, updateNote, deleteNote };
