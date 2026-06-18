const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Recipe title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
    },

    ingredients: [
      {
        name: {
          type: String,
          required: true,
        },

        quantity: {
          type: String,
          required: true,
        },
      },
    ],

    instructions: [
      {
        type: String,
        required: true,
      },
    ],

    image: {
      type: String,
      default: "",
    },

    cookingTime: {
      type: Number,
      required: true,
    },

    servings: {
      type: Number,
      required: true,
    },

    tags: [String],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

recipeSchema.index({
  title: "text",
});

recipeSchema.index({
  "ingredients.name": 1,
});

recipeSchema.index({
  tags: 1,
});

module.exports = mongoose.model(
  "Recipe",
  recipeSchema
);