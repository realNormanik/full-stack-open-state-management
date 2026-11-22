import express from "express";
import jsonServer from "json-server";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "..", "db.json");

const initialData = JSON.parse(fs.readFileSync(dbPath, "utf8"));
const router = jsonServer.router(initialData);
const app = express();

app.use(jsonServer.defaults());
app.use(router);

export default app;

if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3001;

  app.listen(port, () => {
    console.log(`JSON Server API is running at http://localhost:${port}`);
  });
};