var User = require("../models/user").User;

module.exports = function(req, res, next){
	if(!req.session.user_id){
		res.redirect("/login");
	}
	else{
		/*User.findById(req.user_id).then(function(user_data){

			res.local = {user:user_data};
		}, function(err){
			console.log(err);
			res.redirect("/login");
		});*/

		User.findById(req.session.user_id, function(err, user_data){
			if(err){
				res.redirect("/login");
			}else{
				res.locals = {user:user_data};
				next();
			}
		});
		
	}


}