const { body } = require("express-validator");

const registerValidation = [
  body("username")
    .notEmpty()
    .withMessage("Username required")
    .isLength({ min: 3 }),

  body("email")
    .isEmail()
    .withMessage("Valid email required"),

  body("password")
    .isLength({ min: 8 })
    .withMessage(
      "Password must be at least 8 characters"
    ),
];

const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Valid email required"),

  body("password")
    .notEmpty()
    .withMessage("Password required"),
];

module.exports = {
  registerValidation,
  loginValidation,
};