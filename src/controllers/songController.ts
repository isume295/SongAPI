import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Song } from '../models/Song';

// create a song
const createSong = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, artist, album, genre } = req.body;
    const song = new Song({
      id: new mongoose.Types.ObjectId(),
      title,
      artist,
      album,
      genre
    });

    const newSong = await song.save();
    return res.status(201).json({ song: newSong });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

// get song by ID
const readSong = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const songId = req.params.songId;
    const song = await Song.findById(songId);

    if (song) {
      return res.status(200).json({ song });
    } else {
      return res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

// get all songs
const readAllSong = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const songs = await Song.find().exec();
    return res.status(200).json({ songs });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

// update a song
const updateSong = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const songId = req.params.songId;
    const song = await Song.findById(songId);

    if (song) {
      song.set(req.body);
      const updatedSong = await song.save();
      return res.status(201).json({ song: updatedSong });
    } else {
      return res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

// delete a song
const deleteSong = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const songId = req.params.songId;
    const song = await Song.findByIdAndDelete(songId);

    if (song) {
      return res.status(200).json({ message: 'Deleted' });
    } else {
      return res.status(404).json({ error: new Error('Song not found!') });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

// generate statistics
const calculateStatistics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const songs = await Song.find().exec();
    const totalSongs = songs.length;
    const artists = [...new Set(songs.map((song) => song.artist))];
    const totalArtists = artists.length;
    const albums = [...new Set(songs.map((song) => song.album))];
    const totalAlbums = albums.length;
    const genres = [...new Set(songs.map((song) => song.genre))];
    const totalGenres = genres.length;

    return res.status(200).json({
      totalSongs,
      totalArtists,
      totalAlbums,
      totalGenres
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

// number of songs & albums each artist has
const artistSong = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const artists = await Song.distinct('artist');
    const artistStats = [];

    for (const artistName of artists) {
      const songCount = await Song.countDocuments({ artist: artistName });
      const albumCount = await Song.distinct('album', { artist: artistName }).countDocuments();

      artistStats.push({
        artist: artistName,
        songCount,
        albumCount
      });
    }

    return res.status(200).json(artistStats);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

// number of songs in each album
const albumSong = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const albums = await Song.distinct('album');
    const albumStats = [];

    for (const albumName of albums) {
      const songCount = await Song.countDocuments({ album: albumName });

      albumStats.push({
        album: albumName,
        songCount
      });
    }

    return res.status(200).json(albumStats);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

//number of songs in each genre
const genreSong = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const genres = await Song.distinct('genre');
    const genreStats = [];

    for (const genreName of genres) {
      const songCount = await Song.countDocuments({ genre: genreName });

      genreStats.push({
        genre: genreName,
        songCount
      });
    }

    return res.status(200).json(genreStats);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export default { createSong, readSong, readAllSong, updateSong, deleteSong, calculateStatistics, artistSong, albumSong, genreSong };
