var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var imagen_schema =  new Schema({
	title: {type:String, required:true},
	creator: {type: Schema.TypesObjectId, rel:"User"}
});

var Imagen = mongoose.model("Imagen", imagen_schema);

module.exports = Imagen