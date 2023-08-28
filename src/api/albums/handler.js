class AlbumsHandler {
  constructor(service, validator, songService, StorageService, UploadsValidator) {
    this._service = service;
    this._validator = validator;
    this._songService = songService;
    this._storageService = StorageService;
    this._uploadsValidator = UploadsValidator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);

    this.postUploadCoverHandler = this.postUploadCoverHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const albumId = await this._service.addAlbum(request.payload);
    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumsHandler() {
    const albums = await this._service.getAlbums();
    return {
      status: 'success',
      data: {
        albums,
      },
    };
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    album.songs = await this._songService.getSongByAlbumId(id);
    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;
    await this._service.editAlbumById(id, request.payload);
    return h.response({
      status: 'success',
      message: 'Album berhasil diperbarui',
    });
  }

  async deleteAlbumByIdHandler(request, h) {
    const {
      id,
    } = request.params;
    await this._service.deleteAlbumById(id);
    return h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus',
    });
  }

  async postUploadCoverHandler(request, h) {
    const { id } = request.params;
    const { cover } = request.payload;
    await this._service.checkAlbum(id);
    this._uploadsValidator.validateImageHeaders(cover.hapi.headers);
    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/albums/covers/${filename}`;
    await this._service.editAlbumToAddCoverById(id, fileLocation);
    const response = h.response({
      status: 'success',
      message: 'Cover berhasil diupload',
    });
    response.code(201);
    return response;
  }
}

module.exports = AlbumsHandler;
