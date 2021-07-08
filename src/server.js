const Hapi = require('@hapi/hapi');
// const routes = require('./routes');

const init = async () => {
  const server = Hapi.Server({
    port: 5500,
    host: 'localhost'
  });

  // server.route(routes);
  await server.start();
  console.log(`Server runing on ${server.info.uri}`);
};

init();
