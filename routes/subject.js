const router = require("express").Router();
let Subject = require('../models/subject.model');

router.route('/').get((req, res) => {
    Subject.find()
        .then(subjects => res.json(subjects))
        .catch(err => res.status(400).json('Error: ' + err))
  });

router.route('/add').post((req, res) => {
    const username = req.body.username;
    const subject = req.body.subject;

    const newSubject = new Subject({
        username,
        subject,
    });

    newSubject.save()
        .then(() => res.json('Subject added!'))
        .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/:id').get((req, res) => {
    Subject.findById(req.params.id)
        .then(subject => res.json(subject))
        .catch(err => res.status(400).json('Error: ' + err))
});

router.route('/:id').delete((req, res) => {
    Subject.findByIdAndDelete(req.params.id)
        .then(() => res.json('Subject deleted.'))
        .catch(err => res.status(400).json('Error: ' + err))
});

router.route('/update/:id').post((req, res) => {
    Subject.findById(req.params.id)
        .then(each => {
            each.username = req.body.username;
            each.subject = req.body.subject;

            each.save()
                .then(() => res.json('Subject updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error :' + err));
});

module.exports = router;