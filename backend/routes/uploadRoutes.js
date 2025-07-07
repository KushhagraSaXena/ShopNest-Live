import path from "path";
import express from "express";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({  //using the disk storage engine to store files on the server
  // destination and filename are functions that determine where the file will be stored and how it will be named
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = path.extname(file.originalname).toLowerCase();  //extname is the file extension of the uploaded file
  // mimetype is the type of the file, e.g. image/jpeg, image/png its nodejs built-in module to get the file extension and function to get the mimetype of the file
  const mimetype = file.mimetype;

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Images only"), false);
  }
};

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

router.post("/", (req, res) => {
  uploadSingleImage(req, res, (error) => {
    if (error) {
      res.status(400).send({ message: error.message });
    } else if (req.file) {
      res.status(200).send({
                toast: {
          success: true,
          status: "success",
          message: "Image uploaded Successfully",
        },
        message: "Image uploaded Successfully",
        image: `/${req.file.path}`,
      });
    } else {
      res.status(400).send({ message: "No image file provided" });
    }
  });
});

export default router;