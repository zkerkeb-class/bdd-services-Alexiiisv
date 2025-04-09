const express = require("express");
const router = express.Router();
const { pool } = require("../config/database");

// Exemple de route GET
router.get("/test", async (req, res) => {
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
router.post("/data", async (req, res) => {
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

module.exports = router;
