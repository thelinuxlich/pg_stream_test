import { pipeline } from 'node:stream/promises'
import fs from "node:fs";
import { createDatabase } from "./database.js";

const generateLine = (row) => {
    row.description = `Row ${row.num}`;
    row.date = new Date().toString();
    return `${row.num}, ${row.description}, ${row.date}` + "\n"
}

const startStream = async () => {
  //const file = Bun.file("output.csv");
  //const writer = file.writer();
  const startTime = Date.now();
  const sql = createDatabase();
  const cursor = sql`SELECT * FROM generate_series(0, 1000000) num`.cursor(1000)
  try {
    // comment this await pipeline if you will use Bun
    await pipeline(cursor, async function* (source, { signal }) { 
      for await (const [row] of source) {
        yield generateLine(row);
      }
    }, fs.createWriteStream("output.csv"))
    /* this is for Bun
    for await (const [row] of cursor) {
      writer.write(generateLine(row));
    }
    writer.end();*/
  const endTime = Date.now()
  console.log(`Time taken: ${endTime - startTime} ms`)
  } catch (e) {
    console.error(e)
  }
};

await startStream().catch(e => console.error(e));
