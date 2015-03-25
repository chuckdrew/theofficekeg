module.exports = function auth() {
    return function auth(req,res,next) {
        if (req.user) {
            return next()
        } else {
            res.apiRes(false, 'Session Expired', null);
        }
    }
}