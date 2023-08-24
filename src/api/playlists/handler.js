class PlaylistsHandler {
  constructor(
    playlistsService,
    playlistsongsService,
    playlistsSongsActivitiesService,
    usersService,
    validator,
  ) {
    this._playlistsService = playlistsService;
    this._playlistsongsService = playlistsongsService;
    this._playlistsSongsActivitiesService = playlistsSongsActivitiesService;
    this._usersService = usersService;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);

    this.postPlaylistsongHandler = this.postPlaylistsongHandler.bind(this);
    this.getPlaylistsongByIdHandler = this.getPlaylistsongByIdHandler.bind(this);
    this.deletePlaylistsongHandler = this.deletePlaylistsongHandler.bind(this);

    this.getPlaylistActivitiesHandler = this.getPlaylistActivitiesHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);
    const {
      name = 'untitled',
    } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const playlistId = await this._playlistsService.addPlaylist({
      name, owner: credentialId,
    });
    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._playlistsService.getPlaylists(credentialId);
    const playlistsProps = playlists.map((playlist) => ({
      id: playlist.id,
      name: playlist.name,
      username: playlist.username,
    }));
    return h.response({
      status: 'success',
      data: {
        playlists: playlistsProps,
      },
    });
  }

  async deletePlaylistByIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistOwner(id, credentialId);
    await this._playlistsService.deletePlaylistById(id);
    return h.response({
      status: 'success',
      message: 'Playlist berhasil dihapus',
    });
  }

  async postPlaylistsongHandler(request, h) {
    this._validator.validatePlaylistsongPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const playlistsongId = await this._playlistsongsService.addPlaylistsong(songId, playlistId);
    const pActivities = await this._playlistsSongsActivitiesService.activitiesAddSongPlaylist(
      playlistId,
      songId,
      credentialId,
    );
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke dalam playlist',
      data: {
        playlistsongId,
        pActivities,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsongByIdHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const playlists = await this._playlistsService.getPlaylistById(playlistId);
    const songs = await this._playlistsongsService.getPlaylistsongById(playlistId);
    playlists.songs = songs;
    return {
      status: 'success',
      data: {
        playlist: playlists,
      },
    };
  }

  async deletePlaylistsongHandler(request, h) {
    this._validator.validatePlaylistsongPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistsongsService.deletePlaylistsong(songId, playlistId);
    await this._playlistsSongsActivitiesService.activitiesDeleteSongPlaylist(
      playlistId,
      songId,
      credentialId,
    );
    return h.response({
      status: 'success',
      message: 'Lagu berhasil dihapus',
    });
  }

  async getPlaylistActivitiesHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const activities = await this._playlistsSongsActivitiesService.getActivitiesSongPlaylist(
      playlistId,
    );
    return {
      status: 'success',
      data: activities,
    };
  }
}

module.exports = PlaylistsHandler;
