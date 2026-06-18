const Recipe = require("../models/Recipe");

const { validationResult } =
  require("express-validator");

  const createRecipe = async (
  req,
  res,
  next
) => {
  try {
    const errors =
      validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400);

      throw new Error(
        errors.array()[0].msg
      );
    }

    const {
      title,
      description,
      ingredients,
      instructions,
      image,
      cookingTime,
      servings,
      tags,
    } = req.body;

    const recipe =
      await Recipe.create({
        title,
        description,
        ingredients,
        instructions,
        image,
        cookingTime,
        servings,
        tags,
        createdBy: req.user._id,
      });

    res.status(201).json({
      success: true,
      recipe,
    });
  } catch (error) {
    next(error);
  }
};


const getRecipes = async (
  req,
  res,
  next
) => {
  try {
    const page =
      parseInt(req.query.page) || 1;

    const limit =
      parseInt(req.query.limit) || 10;

    const skip =
      (page - 1) * limit;

    const totalRecipes =
      await Recipe.countDocuments();

    const recipes =
      await Recipe.find()
        .populate(
          "createdBy",
          "username email avatar"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit);

    res.status(200).json({
      success: true,

      page,

      limit,

      totalRecipes,

      totalPages: Math.ceil(
        totalRecipes / limit
      ),

      recipes,
    });
  } catch (error) {
    next(error);
  }
};

 

const getRecipeById = async (
  req,
  res,
  next
) => {
  try {
    const recipe =
      await Recipe.findById(
        req.params.id
      ).populate(
        "createdBy",
        "username email avatar"
      );

    if (!recipe) {
      res.status(404);

      throw new Error(
        "Recipe not found"
      );
    }

    res.status(200).json({
      success: true,
      recipe,
    });
  } catch (error) {
    next(error);
  }
};


const updateRecipe = async (
  req,
  res,
  next
) => {
  try {
    const recipe =
      await Recipe.findById(
        req.params.id
      );

    if (!recipe) {
      res.status(404);

      throw new Error(
        "Recipe not found"
      );
    }

    // Ownership Check
    if (
      recipe.createdBy.toString() !==
      req.user._id.toString()
    ) {
      res.status(403);

      throw new Error(
        "Not authorized to update this recipe"
      );
    }

    const updatedRecipe =
      await Recipe.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      recipe: updatedRecipe,
    });
  } catch (error) {
    next(error);
  }
};

const deleteRecipe = async (
  req,
  res,
  next
) => {
  try {
    const recipe =
      await Recipe.findById(
        req.params.id
      );

    if (!recipe) {
      res.status(404);

      throw new Error(
        "Recipe not found"
      );
    }

    // Ownership Check
    if (
      recipe.createdBy.toString() !==
      req.user._id.toString()
    ) {
      res.status(403);

      throw new Error(
        "Not authorized to delete this recipe"
      );
    }

    await recipe.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Recipe deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


const searchByIngredient = async (
  req,
  res,
  next
) => {
  try {
    const ingredient =
      req.query.ingredient;

    if (!ingredient) {
      res.status(400);
      throw new Error(
        "Ingredient is required"
      );
    }

    const page =
      parseInt(req.query.page) || 1;

    const limit =
      parseInt(req.query.limit) || 10;

    const skip =
      (page - 1) * limit;

    const recipes =
      await Recipe.find({
        "ingredients.name": {
          $regex: ingredient,
          $options: "i",
        },
      })
        .select(
          "title image cookingTime servings createdBy"
        )
        .populate(
          "createdBy",
          "username avatar"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit);

    res.status(200).json({
      success: true,
      count: recipes.length,
      page,
      limit,
      recipes,
    });
  } catch (error) {
    next(error);
  }
};

const searchByIngredients = async (
  req,
  res,
  next
) => {
  try {
    const ingredients =
      req.query.ingredients;

    if (!ingredients) {
      res.status(400);
      throw new Error(
        "Ingredients are required"
      );
    }

    const ingredientArray =
      ingredients
        .split(",")
        .map((item) =>
          item.trim()
        );

    const page =
      parseInt(req.query.page) || 1;

    const limit =
      parseInt(req.query.limit) || 10;

    const skip =
      (page - 1) * limit;

    const recipes =
      await Recipe.find({
        $and: ingredientArray.map(
          (ingredient) => ({
            "ingredients.name": {
              $regex: `^${ingredient}$`,
              $options: "i",
            },
          })
        ),
      })
        .select(
          "title image cookingTime servings createdBy"
        )
        .populate(
          "createdBy",
          "username avatar"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit);

    res.status(200).json({
      success: true,
      count: recipes.length,
      page,
      limit,
      recipes,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  searchByIngredient,
  searchByIngredients,
};