const express =
  require("express");

const router =
  express.Router();

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

const {
  addPantryItem,
  getPantry,
  deletePantryItem,
  getRecipeMatches,
} = require(
  "../controllers/pantryController"
);

router.post("/", protect, addPantryItem);

router.get("/", protect, getPantry);

router.get(
  "/matches",
  protect,
  getRecipeMatches
);

router.delete(
  "/:itemId",
  protect,
  deletePantryItem
);

module.exports = router;