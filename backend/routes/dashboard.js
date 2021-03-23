const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({
    user: req.user, // token payload information
    },
  );
});

const subjectRouter = require('./subject')
router.use('/subjects', subjectRouter)

const detailRouter = require('./detail')
router.use('/details', detailRouter)

module.exports = router;