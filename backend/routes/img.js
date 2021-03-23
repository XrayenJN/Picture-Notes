const fs = require('fs');
let Img = require("../models/ImgModel");
const multer = require('multer');
const router = require("express").Router();

const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, 'uploads/')
    }
  });

const upload = multer({ storage: storage });
router.route('/')
.post(upload.single('file'), function(req, res) {
    var new_img = new Img;
    new_img.img.data = fs.readFileSync(req.file.path)
    new_img.img.contentType = 'image/jpeg';  // or 'image/png'
    new_img.save();
    res.json({ 
        message: 'New image added to the db!',
        new_img: new_img._id
    });
    })
.get(function(req, res) {
    Img.find({}, 'img createdAt', function(err, img) {
        if (err)
            res.send(err);

        console.log(img);
        res.contentType('json');
        res.send(img);
    }).sort({ createdAt: 'desc' });
});

router.route('/:id').delete((req, res) => {
    Img.findByIdAndDelete(req.params.id)
        .then(() => res.json('Image deleted'))
        .catch(err => res.status(400).json("Error: " + err))
})

module.exports = router;