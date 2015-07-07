module.exports = function(requiredRole) {
    return function auth(req,res,next) {
        if (req.user) {
            if(req.user.hasRole(requiredRole)) {
                return next();
            } else {
                res.status(403).apiRes(false, 'You do not have permission to use this action.', null);
            }
        } else {
            res.status(401).apiRes(false, 'Please login on create a new account.', null);
        }
    }
}