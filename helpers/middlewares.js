module.exports = {

    isAuth: function(req, res, next){
        if(!req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg', "You aren't authenticated");
        res.redirect("/login");
    }  
}  