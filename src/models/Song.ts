import mongoose from 'mongoose';

// define the schema for our song model
const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  album: String,
  genre: String
});

export const Song = mongoose.model('Song', songSchema);
