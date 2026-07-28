import initSqlJs, { Database } from 'sql.js';
import path from 'path';
import fs from 'fs';
import { app } from 'electron';

let db: Database;

export async function initDatabase(): Promise<Database> {
  const SQL = await initSqlJs();
  const dbPath = path.join(app.getPath('userData'), 'ar-sports.db');

  // Load existing database or create new one
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // Run migrations
  runMigrations(db);

  // Save to disk
  saveDatabase(dbPath);

  return db;
}

export function getDatabase(): Database {
  if (!db) throw new Error('Database not initialized');
  return db;
}

export function saveDatabase(dbPath?: string): void {
  if (!db) return;
  const filePath = dbPath || path.join(app.getPath('userData'), 'ar-sports.db');
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(filePath, buffer);
}

function runMigrations(database: Database) {
  // Create migrations table
  database.run(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      applied_at TEXT DEFAULT (datetime('now'))
    )
  `);

  const migrations: Array<{ name: string; sql: string }> = [
    {
      name: '001_initial_schema',
      sql: `
        -- Teams
        CREATE TABLE IF NOT EXISTS teams (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          short_name TEXT NOT NULL,
          logo TEXT,
          primary_color TEXT NOT NULL DEFAULT '#1E3A5F',
          secondary_color TEXT NOT NULL DEFAULT '#0D1B2A',
          text_color TEXT NOT NULL DEFAULT '#FFFFFF',
          coach TEXT,
          captain_id TEXT,
          created_at TEXT DEFAULT (datetime('now')),
          updated_at TEXT DEFAULT (datetime('now'))
        );

        -- Players
        CREATE TABLE IF NOT EXISTS players (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          display_name TEXT NOT NULL,
          photo TEXT,
          role TEXT NOT NULL DEFAULT 'BATSMAN',
          batting_hand TEXT NOT NULL DEFAULT 'RIGHT',
          bowling_hand TEXT DEFAULT 'RIGHT',
          bowling_style TEXT,
          date_of_birth TEXT,
          nationality TEXT,
          jersey_number INTEGER,
          is_captain INTEGER DEFAULT 0,
          is_wicket_keeper INTEGER DEFAULT 0,
          created_at TEXT DEFAULT (datetime('now')),
          updated_at TEXT DEFAULT (datetime('now'))
        );

        -- Team-Player junction
        CREATE TABLE IF NOT EXISTS team_players (
          team_id TEXT NOT NULL,
          player_id TEXT NOT NULL,
          PRIMARY KEY (team_id, player_id),
          FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
          FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
        );

        -- Tournaments
        CREATE TABLE IF NOT EXISTS tournaments (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          short_name TEXT,
          logo TEXT,
          type TEXT NOT NULL DEFAULT 'LEAGUE',
          start_date TEXT NOT NULL,
          end_date TEXT,
          venue TEXT,
          status TEXT NOT NULL DEFAULT 'UPCOMING',
          created_at TEXT DEFAULT (datetime('now')),
          updated_at TEXT DEFAULT (datetime('now'))
        );

        -- Tournament-Team junction
        CREATE TABLE IF NOT EXISTS tournament_teams (
          tournament_id TEXT NOT NULL,
          team_id TEXT NOT NULL,
          PRIMARY KEY (tournament_id, team_id),
          FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
          FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
        );

        -- Matches
        CREATE TABLE IF NOT EXISTS matches (
          id TEXT PRIMARY KEY,
          tournament_id TEXT,
          match_number INTEGER,
          team1_id TEXT NOT NULL,
          team2_id TEXT NOT NULL,
          venue TEXT,
          date TEXT NOT NULL,
          format TEXT NOT NULL DEFAULT 'T20',
          total_overs INTEGER NOT NULL DEFAULT 20,
          status TEXT NOT NULL DEFAULT 'UPCOMING',
          toss_winning_team_id TEXT,
          toss_decision TEXT,
          result_winning_team_id TEXT,
          result_margin TEXT,
          result_is_tie INTEGER DEFAULT 0,
          result_is_no_result INTEGER DEFAULT 0,
          result_method TEXT DEFAULT 'NORMAL',
          result_summary TEXT,
          player_of_match TEXT,
          is_super_over INTEGER DEFAULT 0,
          is_day_night INTEGER DEFAULT 0,
          created_at TEXT DEFAULT (datetime('now')),
          updated_at TEXT DEFAULT (datetime('now')),
          FOREIGN KEY (tournament_id) REFERENCES tournaments(id),
          FOREIGN KEY (team1_id) REFERENCES teams(id),
          FOREIGN KEY (team2_id) REFERENCES teams(id)
        );

        -- Innings
        CREATE TABLE IF NOT EXISTS innings (
          id TEXT PRIMARY KEY,
          match_id TEXT NOT NULL,
          innings_number INTEGER NOT NULL,
          batting_team_id TEXT NOT NULL,
          bowling_team_id TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'NOT_STARTED',
          total_runs INTEGER DEFAULT 0,
          total_wickets INTEGER DEFAULT 0,
          total_balls INTEGER DEFAULT 0,
          extras INTEGER DEFAULT 0,
          extras_wides INTEGER DEFAULT 0,
          extras_no_balls INTEGER DEFAULT 0,
          extras_byes INTEGER DEFAULT 0,
          extras_leg_byes INTEGER DEFAULT 0,
          extras_penalties INTEGER DEFAULT 0,
          current_run_rate REAL DEFAULT 0,
          FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
          FOREIGN KEY (batting_team_id) REFERENCES teams(id),
          FOREIGN KEY (bowling_team_id) REFERENCES teams(id)
        );

        -- Ball events
        CREATE TABLE IF NOT EXISTS ball_events (
          id TEXT PRIMARY KEY,
          match_id TEXT NOT NULL,
          innings_id TEXT NOT NULL,
          over_number INTEGER NOT NULL,
          ball_number INTEGER NOT NULL,
          type TEXT NOT NULL,
          runs_scored INTEGER DEFAULT 0,
          extras INTEGER DEFAULT 0,
          total_runs INTEGER DEFAULT 0,
          batsman_id TEXT NOT NULL,
          non_striker_id TEXT NOT NULL,
          bowler_id TEXT NOT NULL,
          wicket_type TEXT,
          wicket_batsman_id TEXT,
          wicket_bowler_id TEXT,
          wicket_fielder_ids TEXT,
          is_free_hit INTEGER DEFAULT 0,
          is_legal_delivery INTEGER DEFAULT 1,
          commentary TEXT,
          timestamp TEXT DEFAULT (datetime('now')),
          FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
          FOREIGN KEY (innings_id) REFERENCES innings(id) ON DELETE CASCADE
        );

        -- Batter innings stats
        CREATE TABLE IF NOT EXISTS batter_innings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          innings_id TEXT NOT NULL,
          player_id TEXT NOT NULL,
          runs INTEGER DEFAULT 0,
          balls INTEGER DEFAULT 0,
          fours INTEGER DEFAULT 0,
          sixes INTEGER DEFAULT 0,
          is_out INTEGER DEFAULT 0,
          dismissal TEXT,
          wicket_type TEXT,
          bowler_id TEXT,
          fielder_ids TEXT,
          minutes INTEGER,
          FOREIGN KEY (innings_id) REFERENCES innings(id) ON DELETE CASCADE,
          FOREIGN KEY (player_id) REFERENCES players(id)
        );

        -- Bowler innings stats
        CREATE TABLE IF NOT EXISTS bowler_innings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          innings_id TEXT NOT NULL,
          player_id TEXT NOT NULL,
          balls_bowled INTEGER DEFAULT 0,
          maidens INTEGER DEFAULT 0,
          runs_conceded INTEGER DEFAULT 0,
          wickets INTEGER DEFAULT 0,
          wides INTEGER DEFAULT 0,
          no_balls INTEGER DEFAULT 0,
          dot_balls INTEGER DEFAULT 0,
          FOREIGN KEY (innings_id) REFERENCES innings(id) ON DELETE CASCADE,
          FOREIGN KEY (player_id) REFERENCES players(id)
        );

        -- Settings
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          updated_at TEXT DEFAULT (datetime('now'))
        );
      `,
    },
  ];

  // Check which migrations have been applied
  const result = database.exec('SELECT name FROM _migrations');
  const applied = new Set(
    result.length > 0 ? result[0].values.map((row) => row[0] as string) : [],
  );

  for (const migration of migrations) {
    if (!applied.has(migration.name)) {
      database.run(migration.sql);
      database.run('INSERT INTO _migrations (name) VALUES (?)', [migration.name]);
      console.log(`Applied migration: ${migration.name}`);
    }
  }
}
