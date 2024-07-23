const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // limit file size to 5MB
}).array('images', 10); // allow up to 10 files

const singleUpload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // limit file size to 5MB
}).single('Catimage'); // single file upload
const blogimageUpload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // limit file size to 5MB
}).single('blogimages'); // single file upload

module.exports = {
    singleUpload,
    upload,
    blogimageUpload
};
