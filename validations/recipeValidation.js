const { body } = require("express-validator");

const createRecipeValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),

  body("cookingTime")
    .isNumeric()
    .withMessage("Cooking time must be a number"),

  body("servings")
    .isNumeric()
    .withMessage("Servings must be a number"),
];

module.exports = {
  createRecipeValidation,
};