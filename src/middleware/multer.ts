import multer from "multer";
import fs from "fs";
import path from "path";
import { Request, Response } from "express";

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = `./public/uploads/slip`;
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const filename =
      file.fieldname + "-" + Date.now() + path.extname(file.originalname);

    cb(null, filename);
  },
});

function checkFileType(file: any, cb: any, res: Response) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (file.size > 1000000) {
    res.status(400).send("Error: File size exceeds the 1MB limit.");
    return cb(new Error("Error: File size exceeds the 1MB limit."));
  }

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    res.send({
      status: false,
      message: "Error: Images only! (jpeg, jpg, png)",
    });
    cb("Error: Images only! (jpeg, jpg, png)");
  }
}

export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb, req.res!);
  },
});
