const mongoose = require(
  "mongoose"
);

const pantrySchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

        unique: true,
      },

      items: [
        {
          name: {
            type: String,

            required: true,

            trim: true,
          },
        },
      ],
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Pantry",
    pantrySchema
  );