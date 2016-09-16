var Imagen = require("../models/imagen");

module.exports = function(imagen, req, res){
	//si el metodo es get y en la url no viene edit retorna true
	if(req.method == 'GET' && req.path.indexOf("edit") < 0){
		return true
	}

	if (typeof image.creator == "undefined") {
		return false;
	}
	
	if(image.creator._id.toString() == res.locals.user._id){
		return true;
	}

	return false;

}