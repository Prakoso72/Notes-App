const config = require('./sqlconfig');
const mssql = require('mssql');

// Add a new row to Note table and a couple rows to Tag table
const addNote = async (title, body, tags) => {
  try {
    const pool = await mssql.connect(config);
    const request = new mssql.Request(pool);

    // Body's data type must be explicitly declared, as the default size for this library's character is 128
    request.input('insertedBody', mssql.VarChar(1500), body);
    request.input('insertedTitle', mssql.VarChar(50), title);

    const noteQuery = 'EXEC insertNote @title = @insertedTitle, @body = @insertedBody; ';
    const response = await request.query(noteQuery);
    const id = response.recordsets[0][0].id;

    let tagQuery = '';

    // Remove duplicates, then pass the element to addTag's @tag parameter
    await [...new Set(tags)].forEach(element => {
      tagQuery += `EXEC addTag @tag = ${element}, @id = ${id};`;
    });

    await request.query(tagQuery);

    await console.log('A note has been inserted');
    pool.close();

    return id;
  } catch (err) {
    console.log(err);
  }
};

const updateNote = async (id, title, body) => {
  try {
    const pool = await mssql.connect(config);
    const query = `EXEC updateNote @id = "${id}", @title = "${title}", @body = "${body}"`;

    const response = await pool.request().query(query);

    pool.close();

    return response.recordsets[0][0].answer;
  } catch (err) {
    console.log(err);
  }
};

const removeNote = async (id) => {
  try {
    const pool = await mssql.connect(config);
    const query = `EXEC updateNote @id = "${id}"`;

    await pool.request().query(query);

    pool.close();
  } catch (err) {
    console.log(err);
  }
};

const getAllNote = async () => {
  try {
    const pool = await mssql.connect(config);
    const query = 'EXEC getAllNote';
    const response = await pool.request().query(query);

    pool.close();

    return response.recordsets[0];
  } catch (err) {
    console.log(err);
  }
};

const getANote = async (id) => {
  try {
    const pool = await mssql.connect(config);
    const query = `EXEC getANote @id = "${id}"`;
    const response = await pool.request().query(query);

    pool.close();

    return response.recordsets[0];
  } catch (err) {
    console.log(err);
  }
};

// 1: true, 0: false
const isNoteExist = async (id, tagCount) => {
  try {
    const pool = await mssql.connect(config);
    const query = `EXEC isNoteExists @id = ${id}, @tagCount = ${tagCount}`;
    const response = await pool.request().query(query);

    pool.close();

    return response.recordsets[0][0].answer;
  } catch (err) {
    console.log(err);
  }
};

const removeTag = (id, tag) => {
  console.log('tes');
};

const addTag = (id, tag) => {
  console.log('tes');
};

const tes = async () => {
  await addNote('title', 'isi', ['tag1', 'tag2', 'tag3', 'tag3']);

  await getAllNote().then(result => {
    console.log(result);
  });

  // await getANote(10).then(result => {
  //   console.log(result);
  // });

  // console.log(await isNoteExist(10, 3));

  // console.log(await updateNote(1, 'tes', 'tes').then(result => result));
};

tes();

module.exports = { addNote, updateNote, removeNote, getAllNote, getANote, isNoteExist, removeTag, addTag };
