import multer, { StorageEngine } from "multer";
import path from "path";
import fs from "fs";

const today = new Date();
const padToTwoDigits = (num: number): string => num.toString().padStart(2, "0");

const currentYear = today.getFullYear().toString();
const currentMonth = padToTwoDigits(today.getMonth() + 1);
export const path_DIR = path.resolve('assets/uploads');
const destinationPath = path.join(path_DIR, currentYear, currentMonth);
const randomNum = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }
    cb(null, destinationPath);
  },
  filename: (req, file, callback) => {
    const dateStr = today.toISOString().split("T")[0];
    const fixedOriginalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    // console.log(fixedOriginalName);
    
    callback(null, `${dateStr}x${randomNum}${fixedOriginalName}`);
  },
});

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
];

export const uploadImg = multer({
  storage: storage,
  // limits: {
  //   fileSize: 1024 * 1024 * 5,
  // },
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});