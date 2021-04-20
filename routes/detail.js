const router = require("express").Router();
let Detail = require('../models/detail.model');
const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, 'uploads/')
    }
  });

const upload = multer({ storage: storage });

router.route('/').get((req, res) => {
    Detail.find()
        .then(details => res.json(details))
        .catch(err => res.status(400).json('Error: ' + err))
  });

router.route('/add').post(upload.single('file'), (req, res) => {
    const username = req.body.username;
    const subject = req.body.subject;
    const description = req.body.description;
    const date = req.body.date;
    const image = req.body.image;

    var newDetail = new Detail({
        username,
        subject,
        description,
        date,
        image
    });

    newDetail.save()
        .then(() => res.json('Detail added!'))
        .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/:id').get((req, res) => {
    Detail.findById(req.params.id)
        .then(detail => res.json(detail))
        .catch(err => res.status(400).json('Error: ' + err))
});

router.route('/:id').delete((req, res) => {
    Detail.findByIdAndDelete(req.params.id)
        .then(() => res.json('Detail deleted.'))
        .catch(err => res.status(400).json('Error: ' + err))
});

router.route('/update/:id').post((req, res) => {
    Detail.findById(req.params.id)
        .then(each => {
            each.username = req.body.username;
            each.subject = req.body.subject;
            each.description = req.body.description;
            each.date = req.body.date;
            each.image = req.body.image;

            each.save()
                .then(() => res.json('Detail updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error :' + err));
});

router.use(function(req, res) {
    res.sendFile(path.join(__dirname, '../client/build/index.html'))
  })

module.exports = router;