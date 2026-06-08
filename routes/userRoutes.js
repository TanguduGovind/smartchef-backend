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
  updateProfile,
  changePassword,
} = require(
  "../controllers/userController"
);

const {
  updateProfileValidation,
  changePasswordValidation,
} = require(
  "../validations/userValidation"
);

router.put(
  "/profile",
  protect,
  updateProfileValidation,
  updateProfile
);

router.put(
  "/change-password",
  protect,
  changePasswordValidation,
  changePassword
);

module.exports = router;