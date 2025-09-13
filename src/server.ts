import { Server } from "http";
import app from "./app";
import config from "./config";

let server: Server;

async function flatshareServer() {
  try {
    server = app.listen(config.port, () => {
      console.log("Sever is running on port ", process.env.PORT);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception 💥", error);
    shutdown();
  });

  process.on("unhandledRejection", (error) => {
    console.error("❌ Failed to connect DB", error);
    shutdown();
  });
}

function shutdown() {
  if (server) {
    server.close(() => {
      console.info("Server closed gracefully 🛑");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
}

flatshareServer();
