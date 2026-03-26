const express = require("express");
const router = express.Router();
const Food = require("../models/Food");

/* =======================================================
   GET ALL FOODS (WITH SEARCH + LIMIT)
   ======================================================= */

router.get("/", async (req, res, next) => {
  try {
    const { search = "", limit = 50 } = req.query;

    const query = search
      ? { nameLower: { $regex: search.toLowerCase(), $options: "i" } }
      : {};

    const foods = await Food.find(query)
      .limit(Number(limit))
      .lean();

    res.json({
      success: true,
      data: foods,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;