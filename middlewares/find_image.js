var Imagen = require("../models/imagen");

module.exports = function(req, res, next){

	Imagen.findById(req.params.id, function(err, imagen){
		if(imagen != null){
			res.locals.imagen = imagen;
			next();
		} else {
			res.redirect("/app");
		}
	});

}