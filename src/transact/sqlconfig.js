const sqlconfig = {
  user: process.env.DBUSER,
  password: process.env.DBPWD,
  database: process.env.DBNAME,
  server: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
  port: Number(process.env.DBPORT),
  options: {
    trustServerCertificate: process.env.NODE_ENV !== 'production'
  }
};

module.exports = sqlconfig;
