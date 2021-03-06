var express = require("express");
var bodyParser = require("body-parser");
var User = require("./models/user").User;

//manejo de sesiones
//var session = require("express-session");

//manejo de sesiones por cookies
var cookieSession = require("cookie-session");
var router_app = require("./routes_app");
var session_middleware = require("./middlewares/session");
//Sirve para poder utilizar otros metodos http diferentes a POST y GET
var methodOverride = require("method-override");

//dependencia que permite el manejo de archivos
//guarda los archivos en una carpeta temporal
var formidable = require("express-formidable");
var app = express();

//para poder acceder a archivos estaticos de nuestra pagina como css y js
app.use("/public", express.static("public"));

//para poder recibir parametros de formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//secret permite generar identificadores unicos de session
//resave especifica que se session se vuelve a guardar aunque no halla sido modificada
//saveUninitialized si la session debe guardarse aunque no halla sido inicializada
/*app.use(session({
	secret: "adsfjk3h2432kh432jk",
	resave: false,
  saveUninitialized: false
}));*/

app.use(methodOverride("_method"));
app.use(formidable.parse({keepExtensions: true}));

app.use(cookieSession({
	name: "session",
	keys: ["llave-1", "llave-2"]
}));


app.set("view engine", "jade");


app.get("/", function(req, res){
	res.render("index");
});

app.get("/signup", function(req, res){
	User.find(function(err,doc){
		res.render("signup");
	});
});

app.post("/users", function(req,res){
	var user = new User({
		email: req.body.email,
		password:req.body.password,
		password_confirmation: req.body.p_c,
		username: req.body.username
	});
	//como funciona de manera asincrona enviamos un callback, ya que la comunicación que se tiene
	//con la base de datos no queremos que afecte el rendimiento de la página
	user.save().then(function(us){
		res.send("Guardamos tus datos");
	}, function(err){
		if(err){
			res.send("No se pudo guardar la información");
		}
	});
});

app.get("/login", function(req, res){
	res.render("login");
});

app.post("/sessions", function(req,res){
	//consultas con promesas
	User.findOne({email:req.body.email, password: req.body.password}, {username:1, email:1, _id:1}).then(function(usrs){
		if(usrs == null){
			res.send("No se encontro el usuario");
		}else{
			res.locals.user = usrs;
			req.session.user_id = usrs._id;
			res.redirect("/app");
		}
	}, function(err){
		if(err){
			res.send("No se encontro el usuario");
		}
	})
});

app.use("/app", session_middleware);
//Con esto, todas las rutas del archivo router_app necesitan /app/ en la ruta
app.use("/app", router_app);


app.listen(8080);