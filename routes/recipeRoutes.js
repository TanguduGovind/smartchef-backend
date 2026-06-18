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
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  searchByIngredient,
  searchByIngredients,
} = require(
  "../controllers/recipeController"
);


const {
  createRecipeValidation,
} = require(
  "../validations/recipeValidation"
);


router.get("/", getRecipes);

router.get(
  "/search",
  searchByIngredient
);

router.get(
  "/search/multi",
  searchByIngredients
);

router.get(
  "/:id",
  getRecipeById
);

router.post(
  "/",
  protect,
  createRecipeValidation,
  createRecipe
);

router.put(
  "/:id",
  protect,
  updateRecipe
);

router.delete(
  "/:id",
  protect,
  deleteRecipe
);

module.exports = router;