const Pantry =
  require("../models/Pantry");
const Recipe =
  require("../models/Recipe");

const addPantryItem = async (
  req,
  res,
  next
) => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400);

      throw new Error(
        "Ingredient name is required"
      );
    }

    let pantry =
      await Pantry.findOne({
        user: req.user._id,
      });

    // Create pantry if not exists
    if (!pantry) {
      pantry =
        await Pantry.create({
          user: req.user._id,
          items: [],
        });
    }

    pantry.items.push({
      name,
    });

    await pantry.save();

    res.status(201).json({
      success: true,
      pantry,
    });
  } catch (error) {
    next(error);
  }
};

const getPantry = async (
  req,
  res,
  next
) => {
  try {
    const pantry =
      await Pantry.findOne({
        user: req.user._id,
      });

    if (!pantry) {
      return res.status(200).json({
        success: true,
        items: [],
      });
    }

    res.status(200).json({
      success: true,
      pantry,
    });
  } catch (error) {
    next(error);
  }
};


const deletePantryItem = async (
  req,
  res,
  next
) => {
  try {
    const pantry =
      await Pantry.findOne({
        user: req.user._id,
      });

    if (!pantry) {
      res.status(404);

      throw new Error(
        "Pantry not found"
      );
    }

    pantry.items =
      pantry.items.filter(
        (item) =>
          item._id.toString() !==
          req.params.itemId
      );

    await pantry.save();

    res.status(200).json({
      success: true,
      message:
        "Ingredient removed successfully",
      pantry,
    });
  } catch (error) {
    next(error);
  }
};


const getRecipeMatches = async (
  req,
  res,
  next
) => {
  try {
    const pantry = await Pantry.findOne({
      user: req.user._id,
    });

    if (
      !pantry ||
      pantry.items.length === 0
    ) {
      return res.status(200).json({
        success: true,
        matches: [],
      });
    }

    const pantryIngredients =
      pantry.items.map((item) =>
        item.name.toLowerCase()
      );

    const recipes =
      await Recipe.find()
        .select(
          "title image ingredients cookingTime servings"
        );

    const matches =
      recipes.map((recipe) => {
        const recipeIngredients =
          recipe.ingredients.map(
            (ingredient) =>
              ingredient.name.toLowerCase()
          );

        const matchedIngredients =
          recipeIngredients.filter(
            (ingredient) =>
              pantryIngredients.includes(
                ingredient
              )
          );

        const missingIngredients =
          recipeIngredients.filter(
            (ingredient) =>
              !pantryIngredients.includes(
                ingredient
              )
          );

        const matchedCount =
          matchedIngredients.length;

        const matchPercentage =
          Math.round(
            (matchedCount /
              recipeIngredients.length) *
              100
          );

        return {
          recipeId: recipe._id,

          title: recipe.title,

          image: recipe.image,

          cookingTime:
            recipe.cookingTime,

          servings:
            recipe.servings,

          matchPercentage,

          matchedIngredients:
            matchedCount,

          totalIngredients:
            recipeIngredients.length,

          missingIngredients,
        };
      });

    const sortedMatches =
      matches.sort(
        (a, b) =>
          b.matchPercentage -
          a.matchPercentage
      );

    const filteredMatches =
      sortedMatches.filter(
        (recipe) =>
          recipe.matchPercentage >= 30
      );

    res.status(200).json({
      success: true,
      totalMatches:
        filteredMatches.length,
      matches:
        filteredMatches,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  addPantryItem,
  getPantry,
  deletePantryItem,
  getRecipeMatches,
};