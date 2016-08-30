var mongoose = require("mongoose");

//constructor para poder generar los esquemas
var Schema = mongoose.Schema;

//conexión base de datos con mongoose
mongoose.connect("mongodb://localhost/fotos");

var posibles_valores = ["M", "F"];

var password_validation = {
								validator: function(p){
									//El parametro es el dato que estemos validando
									return this.password_confirmation == p;
								},
								message: "Las contraseñas no son iguales"
							};

//crea un objeto que mongoose entiende con la estructura del documento o tabla
//match: validacion por expresiones regulares
var user_schema = new Schema({
	name: {type: String, required: false},
	username: {type: String, required: true, maxlength: [50, "Username muy grande"]},
	password: {type: String, 
							required: true, 
							minlength:[8, "El password es muy corto"],
							validate: password_validation
						},
	age: {type: Number, required: false, min:[5, "La edad no puede ser menor de 5"], max: [100, "La edad no puede ser mayor a 7"]},
	email: {type: String, required: "El email es obligatorio"},
	date_of_birth: {type: Date, required: false},
	sex: {type: String, enum:{values: posibles_valores, message: "Opción no valida"}}
});


//get es la forma como se accede a un valor de un atributo y un set es la forma 
//como se asigna un valor a un atributo
user_schema.virtual("password_confirmation").get(function(){
	return this.p_c;
}).set(function(password){
	this.p_c = password;
});

//creo un modelo y le paso el esquema que quiero que tenga la tabla
var User = mongoose.model("User", user_schema);

module.exports.User = User;