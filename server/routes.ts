import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertGenreSchema, insertMovieSchema, insertSeriesSchema, insertEpisodeSchema, insertAnimeSchema, insertAnimeEpisodeSchema, insertMovieSuggestionSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Setup file upload
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Ensure uploads directory exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

export function registerRoutes(app: Express): Server {
  // Setup authentication routes
  setupAuth(app);

  // Serve uploaded files
  app.use("/uploads", express.static("uploads"));

  // Genre routes
  app.get("/api/genres", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const genres = await storage.getGenres();
    res.json(genres);
  });

  app.get("/api/genres/:category", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { category } = req.params;
    const genres = await storage.getGenresByCategory(category);
    res.json(genres);
  });

  app.post("/api/genres", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const genreData = insertGenreSchema.parse(req.body);
      const genre = await storage.createGenre(genreData);
      res.status(201).json(genre);
    } catch (error) {
      res.status(400).json({ error: "Invalid genre data" });
    }
  });

  app.delete("/api/genres/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const id = parseInt(req.params.id);
    await storage.deleteGenre(id);
    res.sendStatus(200);
  });

  // Movie routes
  app.get("/api/movies", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const movies = await storage.getMovies();
    res.json(movies);
  });

  app.post("/api/movies", upload.single("thumbnail"), async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const movieData = insertMovieSchema.parse({
        ...req.body,
        year: parseInt(req.body.year),
        thumbnailUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
      });
      const movie = await storage.createMovie(movieData);
      res.status(201).json(movie);
    } catch (error) {
      res.status(400).json({ error: "Invalid movie data" });
    }
  });

  app.put("/api/movies/:id", upload.single("thumbnail"), async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const id = parseInt(req.params.id);
      const movieData = insertMovieSchema.partial().parse({
        ...req.body,
        year: req.body.year ? parseInt(req.body.year) : undefined,
        thumbnailUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
      });
      const movie = await storage.updateMovie(id, movieData);
      if (!movie) return res.sendStatus(404);
      res.json(movie);
    } catch (error) {
      res.status(400).json({ error: "Invalid movie data" });
    }
  });

  app.delete("/api/movies/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const id = parseInt(req.params.id);
    await storage.deleteMovie(id);
    res.sendStatus(200);
  });

  // Series routes
  app.get("/api/series", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const series = await storage.getSeries();
    res.json(series);
  });

  app.post("/api/series", upload.single("thumbnail"), async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const seriesData = insertSeriesSchema.parse({
        ...req.body,
        startYear: parseInt(req.body.startYear),
        thumbnailUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
      });
      const series = await storage.createSeries(seriesData);
      res.status(201).json(series);
    } catch (error) {
      res.status(400).json({ error: "Invalid series data" });
    }
  });

  app.delete("/api/series/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const id = parseInt(req.params.id);
    await storage.deleteSeries(id);
    res.sendStatus(200);
  });

  // Episode routes
  app.get("/api/series/:seriesId/episodes", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const seriesId = parseInt(req.params.seriesId);
    const episodes = await storage.getEpisodesBySeriesId(seriesId);
    res.json(episodes);
  });

  app.post("/api/episodes", upload.single("subtitle"), async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const episodeData = insertEpisodeSchema.parse({
        ...req.body,
        seriesId: parseInt(req.body.seriesId),
        seasonNumber: parseInt(req.body.seasonNumber),
        episodeNumber: parseInt(req.body.episodeNumber),
        duration: req.body.duration ? parseInt(req.body.duration) : undefined,
        subtitleLink: req.file ? `/uploads/${req.file.filename}` : req.body.subtitleLink,
      });
      const episode = await storage.createEpisode(episodeData);
      res.status(201).json(episode);
    } catch (error) {
      res.status(400).json({ error: "Invalid episode data" });
    }
  });

  app.delete("/api/episodes/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const id = parseInt(req.params.id);
    await storage.deleteEpisode(id);
    res.sendStatus(200);
  });

  // Anime routes
  app.get("/api/anime", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const anime = await storage.getAnime();
    res.json(anime);
  });

  app.post("/api/anime", upload.single("thumbnail"), async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const animeData = insertAnimeSchema.parse({
        ...req.body,
        year: parseInt(req.body.year),
        thumbnailUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
      });
      const anime = await storage.createAnime(animeData);
      res.status(201).json(anime);
    } catch (error) {
      res.status(400).json({ error: "Invalid anime data" });
    }
  });

  app.delete("/api/anime/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const id = parseInt(req.params.id);
    await storage.deleteAnime(id);
    res.sendStatus(200);
  });

  // Anime Episode routes
  app.get("/api/anime/:animeId/episodes", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const animeId = parseInt(req.params.animeId);
    const episodes = await storage.getAnimeEpisodesByAnimeId(animeId);
    res.json(episodes);
  });

  app.post("/api/anime-episodes", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const episodeData = insertAnimeEpisodeSchema.parse({
        ...req.body,
        animeId: parseInt(req.body.animeId),
        episodeNumber: parseInt(req.body.episodeNumber),
      });
      const episode = await storage.createAnimeEpisode(episodeData);
      res.status(201).json(episode);
    } catch (error) {
      res.status(400).json({ error: "Invalid anime episode data" });
    }
  });

  app.delete("/api/anime-episodes/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const id = parseInt(req.params.id);
    await storage.deleteAnimeEpisode(id);
    res.sendStatus(200);
  });

  // Movie Suggestions routes
  app.get("/api/movie-suggestions", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const suggestions = await storage.getMovieSuggestions();
    res.json(suggestions);
  });

  app.post("/api/movie-suggestions", async (req, res) => {
    try {
      const suggestionData = insertMovieSuggestionSchema.parse({
        ...req.body,
        year: req.body.year ? parseInt(req.body.year) : undefined,
      });
      const suggestion = await storage.createMovieSuggestion(suggestionData);
      res.status(201).json(suggestion);
    } catch (error) {
      res.status(400).json({ error: "Invalid suggestion data" });
    }
  });

  app.put("/api/movie-suggestions/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const id = parseInt(req.params.id);
    const { status, adminNotes } = req.body;
    
    try {
      const suggestion = await storage.updateMovieSuggestionStatus(id, status, adminNotes);
      if (!suggestion) return res.sendStatus(404);
      res.json(suggestion);
    } catch (error) {
      res.status(400).json({ error: "Invalid update data" });
    }
  });

  app.delete("/api/movie-suggestions/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const id = parseInt(req.params.id);
    await storage.deleteMovieSuggestion(id);
    res.sendStatus(200);
  });

  // Stats endpoint for dashboard
  app.get("/api/stats", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const movies = await storage.getMovies();
    const series = await storage.getSeries();
    const anime = await storage.getAnime();
    const genres = await storage.getGenres();
    const suggestions = await storage.getMovieSuggestions();
    
    res.json({
      movies: movies.length,
      series: series.length,
      anime: anime.length,
      genres: genres.length,
      suggestions: suggestions.filter(s => s.status === 'pending').length,
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
