var express = require("express");
var bodyParser = require("body-parser");
var User = require("./models/user").User;
var session = require("express-session");

var app = express();

//para poder acceder a archivos estaticos de nuestra pagina como css y js
app.use("/public", express.static("public"));

//para poder recibir parametros de formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//secret permite generar identificadores unicos de session
//resave especifica que se session se vuelve a guardar aunque no halla sido modificada
//saveUninitialized si la session debe guardarse aunque no halla sido inicializada
app.use(session({
	secret: "adsfjk3h2432kh432jk",
	resave: false,
  saveUninitialized: false
}));


app.set("view engine", "jade");


app.get("/", function(req, res){
	console.log(req.session.user_id);
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
		if(usrs.length == 0){
			res.send("NO se encontro el usuario");
		}else{
			req.session.user_id = usrs._id
			res.send(usrs);
		}
	}, function(err){
		if(err){
			res.send("No se encontro el usuario");
		}
	})
});


app.listen(8080);