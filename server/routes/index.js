
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.listarTitulos = function(req, res){

	TiposFeriados.findAll().success(function(titulos){
		res.jsonp(titulos);
	});

};

exports.listarFeriados = function(req, res){

	if(!req.params.year) res.send(403);

	Feriados.findAll({ where: { tipos_feriados_id: req.params.tipo, anio: req.params.year }}).success(function(feriados){
		res.jsonp(feriados);
	});

};