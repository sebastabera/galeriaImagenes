var express = require("express");

var Imagen = require("./models/imagen");
//objeto de express para crear rutas
var router = express.Router();

var image_finder_middleware = require("./middlewares/find_image");

router.get("/", function(req,res){
	res.render("app/home");
});

router.get("/imagenes/new", function(req, res){
	res.render("app/imagenes/new");
});

router.all("/imagenes/:id*", image_finder_middleware);

router.get("/imagenes/:id/edit", function(req, res){
		res.render("app/imagenes/edit");
		
});

router.route("/imagenes/:id")
	.get(function(req,res){
		if(!err){
			res.render("app/imagenes/show");
		}
		else{
			console.log("error");
		}
	})
	.put(function(req,res){
		Imagen.update({_id: req.params.id}, {$set:{title:req.body.title}}).then(function(img){
			res.redirect("/app/imagenes/"+req.params.id);
		}, function(err){
			console.log(err);
		});
	})
	.delete(function(req,res){
		Imagen.remove({_id: req.params.id}).then(function(img){
			res.redirect("/app/imagenes");
		}, function(err){
			console.log(err);
		})
	});

router.route("/imagenes")
	.get(function(req,res){
		Imagen.find({creator: res.locals.user.id}, function(err, imagenes){
			if(!err){
				res.render("app/imagenes/index", {imagenes:imagenes});
			}
			else{
				res.redirect("/app/imagenes/"+req.params.id);
				return;
			}
		})
	})
	.post(function(req,res){
		console.log(req.body.archivo);
		var data = {
			title: req.body.title,
			creator: res.locals.user._id
		};

		var imagen = new Imagen(data);

		imagen.save().then(function(ima){
			res.redirect("/app/imagenes/"+imagen._id);
		}, function(err){
			res.render(err);
		});

	});

module.exports = router;