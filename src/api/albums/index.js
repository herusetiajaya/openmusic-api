const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albumsapp',
  version: '1.0.0',
  register: async (server, {
    service,
    validator,
    songService,
    StorageService,
    UploadsValidator,
  }) => {
    const albumsHandler = new AlbumsHandler(
      service,
      validator,
      songService,
      StorageService,
      UploadsValidator,
    );
    server.route(routes(albumsHandler));
  },
};
