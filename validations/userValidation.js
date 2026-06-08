const { body } = require("express-validator");

const updateProfileValidation = [
  body("username")
    .optional()
    .isLength({ min: 3 })
    .withMessage(
      "Username must be at least 3 characters"
    ),

  body("bio")
    .optional()
    .isLength({ max: 500 })
    .withMessage(
      "Bio cannot exceed 500 characters"
    ),

  body("avatar")
    .optional()
    .isURL()
    .withMessage(
      "Avatar must be a valid URL"
    ),
];

const changePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage(
      "Current password is required"
    ),

  body("newPassword")
    .isLength({ min: 8 })
    .withMessage(
      "New password must be at least 8 characters"
    ),
];

module.exports = {
  updateProfileValidation,
  changePasswordValidation,
};