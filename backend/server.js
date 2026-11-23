
import express from 'express';
import axios from 'axios';
const app = express();

import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.OMDB_API_KEY;

const sendError = (res, error, fallback) => {
  const status = error.response?.status || 500;
  const message = error.response?.data?.Error || fallback;
  res.status(status).json({ error: message });
};

app.get('/api/movie/:id', async (req, res) => {
  try {
    const response = await axios.get('https://www.omdbapi.com/', {
      params: { apikey: apiKey, i: req.params.id, plot: 'full' }
    });
    res.json(response.data);
  } catch (error) {
    sendError(res, error, 'Failed to fetch movie data');
  }
});

app.get('/api/search', async (req, res) => {
  try {
    const response = await axios.get('https://www.omdbapi.com/', {
      params: { apikey: apiKey, s: req.query.query }
    });
    res.json(response.data);
  } catch (error) {
    sendError(res, error, 'Failed to fetch movies');
  }
});

export default app;
