// middlewares/uploadFiles.js
import multer from 'multer';
import multerS3 from 'multer-s3';
import s3 from '../configs/s3.config.js';

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'orderingfood-images', 
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  }),
});

const uploadFiles = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: 'Lỗi trong quá trình upload hình ảnh.',
        error: err.message,
      });
    }
    next();
  });
};

export default uploadFiles;
