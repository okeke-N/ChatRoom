module.exports ={
                    ensureAuthenticated: function(req, res, next){
                                        if(req.isAuthenticated){
                                                            return next();
                                        }
                                        req.flash('error_msg', 'please log in to view this message');
                                        res.redirect('/users/login');
                    }
}