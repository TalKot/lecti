module.exports = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(500).send({ error: 'You must be Admin to access!' });
    }
    next();
};
//# sourceMappingURL=requireAdmin.js.map