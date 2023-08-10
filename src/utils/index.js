const mapAlbumsDB = ({
  id,
  name,
  year,
  songs,
}) => ({
  id,
  name,
  year,
  songs,
});

const mapSongDB = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
});
const filterTitleSongByParam = (song, title) => (song.title.toLowerCase().includes(title));
// eslint-disable-next-line max-len
const filterPerformerSongByParam = (song, performer) => (song.performer.toLowerCase().includes(performer));
module.exports = {
  mapAlbumsDB,
  mapSongDB,
  filterPerformerSongByParam,
  filterTitleSongByParam,
};
