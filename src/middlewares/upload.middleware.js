const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let destinationFolder = "";

    if (req.originalUrl.includes("documents")) {
      destinationFolder = "/documents";
    }
    if (req.originalUrl.includes("profilePicture")) {
      destinationFolder = "/profiles";
    }
    if (req.originalUrl.includes("products")) {
      destinationFolder = "/products";
    }

    cb(null, `${__dirname}/../public/uploads${destinationFolder}`);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()} - ${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
