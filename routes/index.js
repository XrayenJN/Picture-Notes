const router = require('express').Router();
const path = require('path');

const usersRouter = require('./users')
router.use('/api/users', usersRouter)

const dashboardRoutes = require("./dashboard");
const verifyToken = require("./validate-token");
router.use('/api/dashboard', verifyToken, dashboardRoutes);

const adminRoute = require("./admin");
router.use('/api/admins', adminRoute)

router.use(function(req, res) {
	res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

module.exports = router;