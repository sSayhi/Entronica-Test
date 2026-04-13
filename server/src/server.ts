import express from "express";
import cors from "cors";
import bodyParse from "body-parser";
import { readdirSync } from "fs";
import morgan from "morgan";
import "dotenv/config";
import path from "path";
import db from "./configs/postgres";
import "reflect-metadata";
import fs from "fs";
// import { path_DIR } from "./middlewares/uploadImg";

const server = express();
const port = process.env.PORT_SERVER || 8080;
const routeDirect = path.join(__dirname, "routes"); // หาตำแหน่ง Routes
const Fileroute = readdirSync(routeDirect); // อ่านไฟล์

server.use(morgan("dev"));
server.use(cors({
  origin: 'http://localhost:4200'
}));
server.use(bodyParse.json());

server.use('/assets', express.static(path.join(__dirname, '../assets')));

Fileroute.forEach(async (file) => {
  if (!file.endsWith(".ts") && !file.endsWith(".js")) return;
  const routePath = path.join(routeDirect, file);
  server.use("/Entronica-test", require(routePath).default);
});

async function GoLive() {
  console.info("⏳ Initializing database...");
  await db
    .initialize()
    .then(() => {
      console.info("✅ Database ready");
    })
    .catch((err) => {
      console.error("Error Databse : %o", err);
    });

  server.listen(port, () => console.info(`🔥🔥 Server Run on Port ${port}`));
}

GoLive();
