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
} = require(
  "../controllers/pantryController"
);

router.post(
  "/",
  protect,
  addPantryItem
);

router.get(
  "/",
  protect,
  getPantry
);

router.delete(
  "/:itemId",
  protect,
  deletePantryItem
);

module.exports = router;