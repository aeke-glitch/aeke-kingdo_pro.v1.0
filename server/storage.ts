import { users, genres, movies, series, episodes, anime, animeEpisodes, movieSuggestions, type User, type InsertUser, type Genre, type InsertGenre, type Movie, type InsertMovie, type Series, type InsertSeries, type Episode, type InsertEpisode, type Anime, type InsertAnime, type AnimeEpisode, type InsertAnimeEpisode, type InsertMovieSuggestion } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Genres
  getGenres(): Promise<Genre[]>;
  getGenresByCategory(category: string): Promise<Genre[]>;
  createGenre(genre: InsertGenre): Promise<Genre>;
  deleteGenre(id: number): Promise<void>;

  // Movies
  getMovies(): Promise<Movie[]>;
  getMovie(id: number): Promise<Movie | undefined>;
  createMovie(movie: InsertMovie): Promise<Movie>;
  updateMovie(id: number, movie: Partial<InsertMovie>): Promise<Movie | undefined>;
  deleteMovie(id: number): Promise<void>;

  // Series
  getSeries(): Promise<Series[]>;
  getSeriesById(id: number): Promise<Series | undefined>;
  createSeries(series: InsertSeries): Promise<Series>;
  updateSeries(id: number, series: Partial<InsertSeries>): Promise<Series | undefined>;
  deleteSeries(id: number): Promise<void>;

  // Episodes
  getEpisodesBySeriesId(seriesId: number): Promise<Episode[]>;
  createEpisode(episode: InsertEpisode): Promise<Episode>;
  deleteEpisode(id: number): Promise<void>;

  // Anime
  getAnime(): Promise<Anime[]>;
  getAnimeById(id: number): Promise<Anime | undefined>;
  createAnime(anime: InsertAnime): Promise<Anime>;
  updateAnime(id: number, anime: Partial<InsertAnime>): Promise<Anime | undefined>;
  deleteAnime(id: number): Promise<void>;

  // Anime Episodes
  getAnimeEpisodesByAnimeId(animeId: number): Promise<AnimeEpisode[]>;
  createAnimeEpisode(episode: InsertAnimeEpisode): Promise<AnimeEpisode>;
  deleteAnimeEpisode(id: number): Promise<void>;

  sessionStore: any;

    // Movie Suggestions
  getMovieSuggestions(): Promise<any>;
  createMovieSuggestion(suggestion: InsertMovieSuggestion): Promise<any>;
  updateMovieSuggestionStatus(id: number, status: string, adminNotes?: string): Promise<any>;
  deleteMovieSuggestion(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private genres: Map<number, Genre>;
  private movies: Map<number, Movie>;
  private series: Map<number, Series>;
  private episodes: Map<number, Episode>;
  private anime: Map<number, Anime>;
  private animeEpisodes: Map<number, AnimeEpisode>;
    private movieSuggestions: Map<number, any>; // Replace 'any' with the actual type
  private currentUserId: number;
  private currentGenreId: number;
  private currentMovieId: number;
  private currentSeriesId: number;
  private currentEpisodeId: number;
  private currentAnimeId: number;
  private currentAnimeEpisodeId: number;
    private currentMovieSuggestionId: number;
  public sessionStore: any;

  constructor() {
    this.users = new Map();
    this.genres = new Map();
    this.movies = new Map();
    this.series = new Map();
    this.episodes = new Map();
    this.anime = new Map();
    this.animeEpisodes = new Map();
    this.movieSuggestions = new Map();
    this.currentUserId = 1;
    this.currentGenreId = 1;
    this.currentMovieId = 1;
    this.currentSeriesId = 1;
    this.currentEpisodeId = 1;
    this.currentAnimeId = 1;
    this.currentAnimeEpisodeId = 1;
    this.currentMovieSuggestionId = 1;

    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    // Initialize with default genres
    this.initializeDefaultGenres();
  }

  private initializeDefaultGenres() {
    const defaultGenres = [
      // Movie genres
      { name: "Action", category: "movies" },
      { name: "Adventure", category: "movies" },
      { name: "Comedy", category: "movies" },
      { name: "Drama", category: "movies" },
      { name: "Horror", category: "movies" },
      { name: "Sci-Fi", category: "movies" },
      { name: "Thriller", category: "movies" },
      { name: "Romance", category: "movies" },
      { name: "Fantasy", category: "movies" },
      { name: "Mystery", category: "movies" },

      // Series genres
      { name: "Crime", category: "series" },
      { name: "Documentary", category: "series" },
      { name: "Reality", category: "series" },
      { name: "Talk Show", category: "series" },
      { name: "News", category: "series" },
      { name: "Game Show", category: "series" },

      // Anime genres
      { name: "Shonen", category: "anime" },
      { name: "Shojo", category: "anime" },
      { name: "Seinen", category: "anime" },
      { name: "Josei", category: "anime" },
      { name: "Mecha", category: "anime" },
      { name: "Isekai", category: "anime" },
      { name: "Slice of Life", category: "anime" },
      { name: "Sports", category: "anime" },
      { name: "Supernatural", category: "anime" },
    ];

    defaultGenres.forEach(genre => {
      const id = this.currentGenreId++;
      this.genres.set(id, { ...genre, id });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Genre methods
  async getGenres(): Promise<Genre[]> {
    return Array.from(this.genres.values());
  }

  async getGenresByCategory(category: string): Promise<Genre[]> {
    return Array.from(this.genres.values()).filter(genre => genre.category === category);
  }

  async createGenre(insertGenre: InsertGenre): Promise<Genre> {
    const id = this.currentGenreId++;
    const genre: Genre = { ...insertGenre, id };
    this.genres.set(id, genre);
    return genre;
  }

  async deleteGenre(id: number): Promise<void> {
    this.genres.delete(id);
  }

  // Movie methods
  async getMovies(): Promise<Movie[]> {
    return Array.from(this.movies.values());
  }

  async getMovie(id: number): Promise<Movie | undefined> {
    return this.movies.get(id);
  }

  async createMovie(insertMovie: InsertMovie): Promise<Movie> {
    const id = this.currentMovieId++;
    const movie: Movie = { 
      ...insertMovie, 
      id, 
      createdAt: new Date(),
      rating: insertMovie.rating || null,
      description: insertMovie.description || null,
      thumbnailUrl: insertMovie.thumbnailUrl || null,
      link360p: insertMovie.link360p || null,
      link480p: insertMovie.link480p || null,
      link720p: insertMovie.link720p || null,
      link1080p: insertMovie.link1080p || null,
      size360p: insertMovie.size360p || null,
      size480p: insertMovie.size480p || null,
      size720p: insertMovie.size720p || null,
      size1080p: insertMovie.size1080p || null,
      torrentLink: insertMovie.torrentLink || null,
      magnetLink: insertMovie.magnetLink || null
    };
    this.movies.set(id, movie);
    return movie;
  }

  async updateMovie(id: number, movieData: Partial<InsertMovie>): Promise<Movie | undefined> {
    const existingMovie = this.movies.get(id);
    if (!existingMovie) return undefined;

    const updatedMovie = { ...existingMovie, ...movieData };
    this.movies.set(id, updatedMovie);
    return updatedMovie;
  }

  async deleteMovie(id: number): Promise<void> {
    this.movies.delete(id);
  }

  // Series methods
  async getSeries(): Promise<Series[]> {
    return Array.from(this.series.values());
  }

  async getSeriesById(id: number): Promise<Series | undefined> {
    return this.series.get(id);
  }

  async createSeries(insertSeries: InsertSeries): Promise<Series> {
    const id = this.currentSeriesId++;
    const series: Series = { 
      ...insertSeries, 
      id, 
      createdAt: new Date(),
      description: insertSeries.description || null,
      thumbnailUrl: insertSeries.thumbnailUrl || null
    };
    this.series.set(id, series);
    return series;
  }

  async updateSeries(id: number, seriesData: Partial<InsertSeries>): Promise<Series | undefined> {
    const existingSeries = this.series.get(id);
    if (!existingSeries) return undefined;

    const updatedSeries = { ...existingSeries, ...seriesData };
    this.series.set(id, updatedSeries);
    return updatedSeries;
  }

  async deleteSeries(id: number): Promise<void> {
    this.series.delete(id);
    // Also delete associated episodes
    Array.from(this.episodes.entries()).forEach(([episodeId, episode]) => {
      if (episode.seriesId === id) {
        this.episodes.delete(episodeId);
      }
    });
  }

  // Episode methods
  async getEpisodesBySeriesId(seriesId: number): Promise<Episode[]> {
    return Array.from(this.episodes.values()).filter(episode => episode.seriesId === seriesId);
  }

  async createEpisode(insertEpisode: InsertEpisode): Promise<Episode> {
    const id = this.currentEpisodeId++;
    const episode: Episode = { 
      ...insertEpisode, 
      id, 
      createdAt: new Date(),
      seriesId: insertEpisode.seriesId || null,
      duration: insertEpisode.duration || null,
      link360p: insertEpisode.link360p || null,
      link480p: insertEpisode.link480p || null,
      link720p: insertEpisode.link720p || null,
      link1080p: insertEpisode.link1080p || null,
      size360p: insertEpisode.size360p || null,
      size480p: insertEpisode.size480p || null,
      size720p: insertEpisode.size720p || null,
      size1080p: insertEpisode.size1080p || null,
      subtitleLink: insertEpisode.subtitleLink || null
    };
    this.episodes.set(id, episode);
    return episode;
  }

  async deleteEpisode(id: number): Promise<void> {
    this.episodes.delete(id);
  }

  // Anime methods
  async getAnime(): Promise<Anime[]> {
    return Array.from(this.anime.values());
  }

  async getAnimeById(id: number): Promise<Anime | undefined> {
    return this.anime.get(id);
  }

  async createAnime(insertAnime: InsertAnime): Promise<Anime> {
    const id = this.currentAnimeId++;
    const anime: Anime = { 
      ...insertAnime, 
      id, 
      createdAt: new Date(),
      thumbnailUrl: insertAnime.thumbnailUrl || null,
      studio: insertAnime.studio || null,
      synopsis: insertAnime.synopsis || null
    };
    this.anime.set(id, anime);
    return anime;
  }

  async updateAnime(id: number, animeData: Partial<InsertAnime>): Promise<Anime | undefined> {
    const existingAnime = this.anime.get(id);
    if (!existingAnime) return undefined;

    const updatedAnime = { ...existingAnime, ...animeData };
    this.anime.set(id, updatedAnime);
    return updatedAnime;
  }

  async deleteAnime(id: number): Promise<void> {
    this.anime.delete(id);
    // Also delete associated episodes
    Array.from(this.animeEpisodes.entries()).forEach(([episodeId, episode]) => {
      if (episode.animeId === id) {
        this.animeEpisodes.delete(episodeId);
      }
    });
  }

  // Anime Episode methods
  async getAnimeEpisodesByAnimeId(animeId: number): Promise<AnimeEpisode[]> {
    return Array.from(this.animeEpisodes.values()).filter(episode => episode.animeId === animeId);
  }

  async createAnimeEpisode(insertAnimeEpisode: InsertAnimeEpisode): Promise<AnimeEpisode> {
    const id = this.currentAnimeEpisodeId++;
    const episode: AnimeEpisode = { 
      ...insertAnimeEpisode, 
      id, 
      createdAt: new Date(),
      animeId: insertAnimeEpisode.animeId || null,
      link360p: insertAnimeEpisode.link360p || null,
      link480p: insertAnimeEpisode.link480p || null,
      link720p: insertAnimeEpisode.link720p || null,
      link1080p: insertAnimeEpisode.link1080p || null,
      size360p: insertAnimeEpisode.size360p || null,
      size480p: insertAnimeEpisode.size480p || null,
      size720p: insertAnimeEpisode.size720p || null,
      size1080p: insertAnimeEpisode.size1080p || null
    };
    this.animeEpisodes.set(id, episode);
    return episode;
  }

  async deleteAnimeEpisode(id: number): Promise<void> {
    this.animeEpisodes.delete(id);
  }

  async getMovieSuggestions(): Promise<any> {
      return Array.from(this.movieSuggestions.values());
  }

  async createMovieSuggestion(suggestion: InsertMovieSuggestion): Promise<any> {
      const id = this.currentMovieSuggestionId++;
      const movieSuggestion = { ...suggestion, id, createdAt: new Date(), status: 'pending' };
      this.movieSuggestions.set(id, movieSuggestion);
      return movieSuggestion;
  }

  async updateMovieSuggestionStatus(id: number, status: string, adminNotes?: string): Promise<any> {
      const existingSuggestion = this.movieSuggestions.get(id);
      if (!existingSuggestion) return undefined;

      const updatedSuggestion = { ...existingSuggestion, status, adminNotes };
      this.movieSuggestions.set(id, updatedSuggestion);
      return updatedSuggestion;
  }

  async deleteMovieSuggestion(id: number): Promise<void> {
      this.movieSuggestions.delete(id);
  }
}

export const storage = new MemStorage();