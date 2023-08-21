/* eslint-disable max-len */
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
  name,
  owner,
  playlist_id,
  song_id,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
  username,
  name,
  owner,
  playlistId: playlist_id,
  songId: song_id,
});
const filterTitleSongByParam = (song, title) => (song.title.toLowerCase().includes(title));
const filterPerformerSongByParam = (song, performer) => (song.performer.toLowerCase().includes(performer));

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
  filterPerformerSongByParam,
  filterTitleSongByParam,
  mapPlaylistsDB,
  mapDBToModelPlaylistSongs,
};
