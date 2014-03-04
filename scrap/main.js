var Cheerio = require('cheerio');
var Request = require('request');


var year = 2014;
var url = 'http://www.mininterior.gov.ar/asuntos_politicos_y_alectorales/dinap/feriados/feriados'+year+'.php';


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

				if(index == 0) values.fecha = text;
				if(index == 1) values.dia = text;
				if(index == 2) values.conmemoracion = text;
			});

			feriados[table_number].values.push(values);
		});
	});

	console.log(feriados[0]);

});

//$ = Cheerio.load('');
