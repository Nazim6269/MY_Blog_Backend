const fs = require("fs/promises");
const path = require("path");

class DBConnection {
  private db: any;
  private dbURL: string;

  constructor(dbUrl: string) {
    this.db = null;
    this.dbURL = dbUrl;
  }

  async connect() {
    try {
      const dbString = await fs.readFile(this.dbURL, { encoding: "utf-8" });

      this.db = JSON.parse(dbString);
    } catch (error) {
      console.error("Failed to read from database file:", error.message);
      throw error;
    }
  }

  async write() {
    try {
      if (this.db) {
        await fs.writeFile(this.dbURL, JSON.stringify(this.db, null, 2));
      }
    } catch (error) {
      console.error("Failed to write to database file:", error.message);
      throw error;
    }
  }
}

const dbUrl = process.env.DB_URL;
const dbConnection = new DBConnection(path.resolve(dbUrl || ""));

module.exports = dbConnection;
