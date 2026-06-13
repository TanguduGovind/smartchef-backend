const uploadImage = async (
  req,
  res,
  next
) => {
  try {
    if (!req.file) {
      res.status(400);

      throw new Error(
        "Please upload an image"
      );
    }

    res.status(200).json({
      success: true,

      imageUrl: req.file.path,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImage,
};