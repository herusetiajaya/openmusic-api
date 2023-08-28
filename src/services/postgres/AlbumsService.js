const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const { mapAlbumsDB } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({
    name,
    year,
  }) {
    const id = `album-${nanoid(16)}`;
    const coverurl = null;
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, name, year, coverurl],
    };
    const fetch = await this._pool.query(query);
    if (!fetch.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }
    return fetch.rows[0].id;
  }

  async getAlbums() {
    const query = 'SELECT * FROM albums';
    const result = await this._pool.query(query);
    return result.rows.map(mapAlbumsDB);
  }

  async getAlbumById(id) {
    const queryAlbum = {
      text: 'SELECT id, name, year, cover_url FROM albums WHERE id = $1',
      values: [id],
    };
    const resultAlbum = await this._pool.query(queryAlbum);
    if (!resultAlbum.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }
    return resultAlbum.rows.map(mapAlbumsDB)[0];
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };
    const fetch = await this._pool.query(query);
    if (!fetch.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };
    const fetch = await this._pool.query(query);
    if (!fetch.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  async checkAlbum(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }

  async editAlbumToAddCoverById(id, fileLocation) {
    const query = {
      text: 'UPDATE albums SET cover_url = $1 WHERE id = $2',
      values: [fileLocation, id],
    };
    await this._pool.query(query);
  }
}
module.exports = AlbumsService;
