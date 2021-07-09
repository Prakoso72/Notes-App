const {
  addNote,
  getNotes,
  getANote,
  updateNote,
  deleteNote
} = require('./handlers');

module.exports = [
  {
    method: 'POST',
    path: '/notes',
    handler: addNote
  },
  {
    method: 'GET',
    path: '/notes',
    handler: getNotes
  },
  {
    method: 'GET',
    path: '/notes/{id}',
    handler: getANote
  },
  {
    method: 'PUT',
    path: '/notes/{id}',
    handler: updateNote
  },
  {
    method: 'DELETE',
    path: '/notes/{id}',
    handler: deleteNote
  }
];
