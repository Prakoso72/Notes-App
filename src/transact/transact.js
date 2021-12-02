const config = require('./sqlconfig');
const mssql = require('mssql');

// Add a new row to Note table and a couple rows to Tag table
const addNote = async (title, body, tags = []) => {
  try {
    const pool = await mssql.connect(config);
    const request = new mssql.Request(pool);

    // Body's data type must be explicitly declared, as the default size for this library's character is 128
    request.input('insertedBody', mssql.VarChar(1500), body);
    request.input('insertedTitle', mssql.VarChar(50), title);
    const noteQuery = 'EXEC insertNote @title = @insertedTitle, @body = @insertedBody; ';
    const response = await request.query(noteQuery);
    const id = response.recordset[0].id;

    let tagQuery = '';
    // Remove duplicates, then pass the element to addTag's @tag parameter
    tags = [...new Set(tags)];
    await tags.forEach(element => {
      tagQuery += `EXEC addTag @tag = ${element}, @id = ${id};`;
    });
    await request.query(tagQuery);

    // Check previous transactions are commited or not
    const checkQuery = `EXEC checkInsertedNote @id = ${id}, @tagCount = ${tags.length}`;
    let status = await request.query(checkQuery);

    if (status.recordset[0].answer === 1) {
      status = id;
      console.log('A note has been inserted');
    } else {
      status = -1;
      console.log('Failed to insert note');
    }

    pool.close();

    return status;
  } catch (err) {
    console.log(err);

    return -1;
  }
};

// update a sepcific row on Note table
const updateNote = async (id, title, body, tags) => {
  try {
    const pool = await mssql.connect(config);
    const request = new mssql.Request(pool);

    if ((await request.query(`SELECT id FROM NOTE WHERE id = ${id}`)).recordset.length === 0) return 0;

    let tagsQuery = `EXEC removeTag @id = ${id}`;
    await request.query(tagsQuery);

    const noteQuery = `EXEC updateNote @id = ${id}, @title = '${title}', @body = '${body}'`;
    await request.query(noteQuery);

    tagsQuery = '';
    tags = [...new Set(tags)];
    await tags.forEach(element => {
      tagsQuery += `EXEC addTag @tag = ${element}, @id = ${id};`;
    });
    await request.query(tagsQuery);

    const checkQuery = `EXEC checkInsertedNote @id = ${id}, @tagCount = ${tags.length}`;
    let status = await request.query(checkQuery);

    if (status.recordset[0].answer === 1) {
      status = 1;
      console.log('A note has been updated');
    } else {
      status = -1;
      console.log('Failed to insert note');
    }

    pool.close();

    return status;
  } catch (err) {
    console.log(err);

    return -1;
  }
};

const removeNote = async (id) => {
  try {
    const pool = await mssql.connect(config);
    const query = `EXEC removeNote @id = "${id}"`;

    const response = await pool.request().query(query);

    pool.close();

    return response.recordset[0].answer;
  } catch (err) {
    console.log(err);

    return -1;
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

    return -1;
  }
};

const getANote = async (id) => {
  try {
    const pool = await mssql.connect(config);
    const query = `EXEC getANote @id = ${id}`;
    const response = await pool.request().query(query);

    pool.close();

    return response.recordsets[0];
  } catch (err) {
    console.log(err);

    return -1;
  }
};

const addTag = async (tag, id) => {
  try {
    const pool = await mssql.connect(config);
    const query = `EXEC addTag @id = "${id}", @tag`;
    const response = await pool.request().query(query);

    pool.close();

    return response.recordsets[0];
  } catch (err) {
    console.log(err);

    return -1;
  }
};

const removeTag = async (id) => {
  try {
    const pool = await mssql.connect(config);
    const query = `EXEC getANote @id = "${id}"`;
    const response = await pool.request().query(query);

    pool.close();

    return response.recordsets[0];
  } catch (err) {
    console.log(err);

    return -1;
  }
};

const tes = async () => {
  // const test = await addNote('title', 'isi', ['tag1', 'tag2', 'tag3', 'tag3']);
  // console.log(test);

  // await updateNote(14, 'Catatan 1 Terupdate', 'Isi', ["Android", "Web"]).then(result => console.log(result));

  // await removeNote(8).then(r => console.log(r));

  // await getAllNote().then(result => {
  //   console.log(result);
  // });

  // console.log(await getAllNote());

  // await getAllNote().then(result => {
  //   console.log(result);
  // });

  // await getANote(1).then(result => {
  //   console.log(result);
  // });

  // console.log(await updateNote(1, 'tes', 'tes').then(result => result));
};

tes();

module.exports = { addNote, updateNote, removeNote, getAllNote, getANote, addTag, removeTag };
