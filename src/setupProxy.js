const proxy = require('http-proxy-middleware');

const port = process.env.PORT || 5000;

module.exports = function(app) {
    app.use(
        proxy([
            "/api/users",
            "/api/users/add",
            "/api/users/login",
            "/api/dashboard/subjects",
            "/api/dashboard/details",
            "/api/dashboard/img_data",
            "/api/admins",
        ], {target: port })
    )
}