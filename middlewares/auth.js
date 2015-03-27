module.exports = function(requiredRole) {
    return function auth(req,res,next) {
        if (req.user) {
            if(req.user.hasRole(requiredRole)) {
                return next();
            } else {
                res.apiRes(false, 'You do not have permission to use this action.', null);
            }
        } else {
            res.apiRes(false, 'Session Expired', null);
        }
    }
}