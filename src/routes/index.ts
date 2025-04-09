import express, { Router, Request, Response } from "express";
import { pool } from "../config/database";

const router: Router = express.Router();

// Exemple de route GET
router.get("/test", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Database connection successful",
      timestamp: result.rows[0].now,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Exemple de route POST
router.post("/data", async (req: Request, res: Response) => {
  const { name, value } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO test_table (name, value) VALUES ($1, $2) RETURNING *",
      [name, value]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
