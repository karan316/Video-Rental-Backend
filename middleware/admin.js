module.exports = function (req, res, next) {
    // auth middleware sets req.user
    // 401 - Unauthorized(user tries to access protected resource but does not supply a valid jwt)
    // 403 - Forbidden (You can't try again to access the resource)
    if (!req.user.isAdmin)
        return res.status(403).send("Access denied. Requires admin privilege.");

    next();
};
