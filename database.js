// DENO
//import postgres from 'https://deno.land/x/postgresjs/mod.js'
import postgres from 'postgres'
export function createDatabase() {
  try {
    return postgres("postgres://postgres:test@localhost:5432/postgres");
  } catch (error) {
    console.error("Error creating database:", error);
    throw error;
  }
}
