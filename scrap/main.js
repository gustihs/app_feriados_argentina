var Cheerio = require('cheerio');
var Request = require('request');
var database = require('../server/database');


function traducirFecha(fecha){

	fecha = fecha.replace("°", "");

	return fecha;
}

database.schema('prod');

sequelize.sync().success(function(){	

	for(var anio = 2010; anio <= 2016; anio++){

		empezarScrapping(anio, function(anio, feriados){
			guardarTipos(feriados);
			Feriados.destroy({anio: anio }).success(function(){
				guardarFeriados(anio, feriados);				
			});		
		});
	}

});

function guardarFeriados(year, feriados){	

	for(var index in feriados){
		var feriado = feriados[index];
		var valores = feriado.values;
		var tipo_feriado = parseInt(index) + 1;
		
		for(var subindex in valores){
			var datos = valores[subindex];
			var feriado_id = (parseInt(subindex) + 1) * tipo_feriado;

			Feriados.create({
				fecha: datos.fecha,
				anio: year,
				dia: datos.dia,
				conmemoracion: datos.conmemoracion,
				tipos_feriados_id: tipo_feriado
			}).error(function(){

			});
		}
	}	

}

function guardarTipos(feriados){

	for(index in feriados){
		
		TiposFeriados.create({
			id: parseInt(index) + 1,
			descripcion: feriados[index].title
		}).error(function(error){

		});
	}
}

function empezarScrapping(anio, callback){

	var url = 'http://www.mininterior.gov.ar/asuntos_politicos_y_alectorales/dinap/feriados/feriados'+anio+'.php';
	
	Request(url, function(error, response, body_response){
		if(error) throw error;

		$ = Cheerio.load(body_response);
		var feriados = [];

		var title = $('h1').text();
		var subtitles = [];

		$('h3').each(function(){
			feriados.push({
				title: this.text().toUpperCase()
			});
		});

		var tables = $('table');

		tables.each(function(table_number){
			var table = this;
			feriados[table_number].values = [];

			table.find('tr').each(function(index){
				if(index == 0) return true;
				var values = {};

				this.find('p').each(function(index){
					var text = this.text();

					if(index == 0) values.fecha = traducirFecha(text);
					if(index == 1) values.dia = text;
					if(index == 2) values.conmemoracion = text;
				});

				feriados[table_number].values.push(values);
			});
		});

		callback(anio, feriados);
	});
}