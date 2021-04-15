const proxy = require('http-proxy-middleware');

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
        ], {target:"http://localhost:5000"})
    )
}