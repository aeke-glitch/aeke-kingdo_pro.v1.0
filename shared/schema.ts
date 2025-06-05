import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const genres = pgTable("genres", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'movies', 'series', 'anime'
});

export const movies = pgTable("movies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  year: integer("year").notNull(),
  genre: text("genre").notNull(),
  rating: text("rating"),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  link360p: text("link_360p"),
  link480p: text("link_480p"),
  link720p: text("link_720p"),
  link1080p: text("link_1080p"),
  size360p: text("size_360p"),
  size480p: text("size_480p"),
  size720p: text("size_720p"),
  size1080p: text("size_1080p"),
  torrentLink: text("torrent_link"),
  magnetLink: text("magnet_link"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const series = pgTable("series", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  startYear: integer("start_year").notNull(),
  genre: text("genre").notNull(),
  status: text("status").notNull(), // 'ongoing', 'completed', 'cancelled', 'hiatus'
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const episodes = pgTable("episodes", {
  id: serial("id").primaryKey(),
  seriesId: integer("series_id").references(() => series.id),
  seasonNumber: integer("season_number").notNull(),
  episodeNumber: integer("episode_number").notNull(),
  title: text("title").notNull(),
  duration: integer("duration"), // in minutes
  link360p: text("link_360p"),
  link480p: text("link_480p"),
  link720p: text("link_720p"),
  link1080p: text("link_1080p"),
  size360p: text("size_360p"),
  size480p: text("size_480p"),
  size720p: text("size_720p"),
  size1080p: text("size_1080p"),
  subtitleLink: text("subtitle_link"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const anime = pgTable("anime", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  year: integer("year").notNull(),
  genre: text("genre").notNull(),
  studio: text("studio"),
  synopsis: text("synopsis"),
  thumbnailUrl: text("thumbnail_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const animeEpisodes = pgTable("anime_episodes", {
  id: serial("id").primaryKey(),
  animeId: integer("anime_id").references(() => anime.id),
  seasonNumber: integer("season_number").notNull(),
  episodeNumber: integer("episode_number").notNull(),
  title: text("title").notNull(),
  link360p: text("link_360p"),
  link480p: text("link_480p"),
  link720p: text("link_720p"),
  link1080p: text("link_1080p"),
  size360p: text("size_360p"),
  size480p: text("size_480p"),
  size720p: text("size_720p"),
  size1080p: text("size_1080p"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGenreSchema = createInsertSchema(genres).omit({
  id: true,
});

export const insertMovieSchema = createInsertSchema(movies).omit({
  id: true,
  createdAt: true,
});

export const insertSeriesSchema = createInsertSchema(series).omit({
  id: true,
  createdAt: true,
});

export const insertEpisodeSchema = createInsertSchema(episodes).omit({
  id: true,
  createdAt: true,
});

export const insertAnimeSchema = createInsertSchema(anime).omit({
  id: true,
  createdAt: true,
});

export const insertAnimeEpisodeSchema = createInsertSchema(animeEpisodes).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Genre = typeof genres.$inferSelect;
export type InsertGenre = z.infer<typeof insertGenreSchema>;

export type Movie = typeof movies.$inferSelect;
export type InsertMovie = z.infer<typeof insertMovieSchema>;

export type Series = typeof series.$inferSelect;
export type InsertSeries = z.infer<typeof insertSeriesSchema>;

export type Episode = typeof episodes.$inferSelect;
export type InsertEpisode = z.infer<typeof insertEpisodeSchema>;

export type Anime = typeof anime.$inferSelect;
export type InsertAnime = z.infer<typeof insertAnimeSchema>;

export type AnimeEpisode = typeof animeEpisodes.$inferSelect;
export type InsertAnimeEpisode = z.infer<typeof insertAnimeEpisodeSchema>;
