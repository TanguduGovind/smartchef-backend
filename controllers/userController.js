const bcrypt = require("bcryptjs");

const User = require("../models/User");

const {
  validationResult,
} = require("express-validator");

const updateProfile = async (
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

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {
      res.status(404);
      throw new Error(
        "User not found"
      );
    }

    user.username =
      req.body.username ||
      user.username;

    user.bio =
      req.body.bio ??
      user.bio;

    user.avatar =
      req.body.avatar ??
      user.avatar;

    const updatedUser =
      await user.save();

    res.status(200).json({
      success: true,
      message:
        "Profile updated successfully",
      user: {
        id: updatedUser._id,
        username:
          updatedUser.username,
        email:
          updatedUser.email,
        bio: updatedUser.bio,
        avatar:
          updatedUser.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (
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
      currentPassword,
      newPassword,
    } = req.body;

    const user =
      await User.findById(
        req.user._id
      ).select("+password");

    const isMatch =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!isMatch) {
      res.status(401);
      throw new Error(
        "Current password is incorrect"
      );
    }

    const salt =
      await bcrypt.genSalt(12);

    user.password =
      await bcrypt.hash(
        newPassword,
        salt
      );

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateProfile,
  changePassword,
};