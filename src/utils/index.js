/* eslint-disable camelcase */
const mapAlbumsDB = ({
  id,
  name,
  year,
}) => ({
  id,
  name,
  year,
});

const mapSongDB = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
  username,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
  username,
});

const mapPlaylistsDB = ({
  id,
  name,
  owner,
  username,
  playlist_id,
  song_id,
}) => ({
  id,
  name,
  owner,
  username,
  playlistId: playlist_id,
  songId: song_id,
});

const mapDBToModelPlaylistSongs = ({
  id,
  title,
  performer,
}) => ({
  id,
  title,
  performer,
});

module.exports = {
  mapAlbumsDB,
  mapSongDB,
  mapPlaylistsDB,
  mapDBToModelPlaylistSongs,
};
