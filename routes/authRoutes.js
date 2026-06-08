const express = require("express");

const router = express.Router();

const {
 registerUser,
 loginUser,
 getMe
}
=
require("../controllers/authController");

const {
 protect
}
=
require("../middleware/authMiddleware");

router.get(
 "/me",
 protect,
 getMe
);

const {
  registerValidation,
  loginValidation,
} = require("../validations/authValidation");

router.post(
  "/register",
  registerValidation,
  registerUser
);

router.post(
  "/login",
  loginValidation,
  loginUser
);

module.exports = router;