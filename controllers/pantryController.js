const Pantry =
  require("../models/Pantry");

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

module.exports = {
  addPantryItem,
  getPantry,
  deletePantryItem,
};