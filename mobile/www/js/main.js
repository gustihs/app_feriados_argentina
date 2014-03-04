
FeriadoListadoView = Backbone.View.extend({

	initialize: function(titulo){
		titulo = titulo.titulo;
		this.collection = new Backbone.Collection;
		var year = 2014;
		var self = this;
		this.collection.url = getServerUrl('feriados/'+titulo.id+'/'+ year);

		this.collection.on('add', function(model, collection){
			var row = '<tr>';
			row += '<td>'+model.get('fecha')+'</td>';
			row += '<td>'+model.get('dia')+'</td>';
			row += '<td>'+model.get('conmemoracion')+'</td>';
			row += '</tr>';
			self.$el.find('tbody').append(row);
		});

		this.tpl = '<h3>'+titulo.descripcion+'</h3>';		
		this.tpl += '<table data-role="table" data-mode="reflow"><thead><th><tr>';
		this.tpl += '<th>Fecha</th>';
		this.tpl += '<th>Día</th>';
		this.tpl += '<th>Conmemoración</th>';
		this.tpl += '</tr></thead><tbody></tbody></table>';

		return this;
	},
	render: function(){
		this.$el.html(this.tpl);
		this.$el.find('table').table();
		this.collection.fetch({dataType: 'jsonp'});
		return this;
	}

});


MainView = Backbone.View.extend({

	el: '#main_content',

	initialize: function(){
		return this;
	},
	render: function(){
		var self = this;

		this.getTipos(function(titulos){
			for(var index in titulos){
				var view = new FeriadoListadoView({ titulo: titulos[index] });
				self.$el.append(view.render().$el);
			}			
		});
	},
	getTipos: function(callback){
		doRequest('titulos').success(function(titulos){
			callback(titulos);
		});
	}

});


function getServerUrl(url){
	return 'http://'+App.server_ip+'/' + url;
}

function doRequest(url, parameters, method){

	parameters = parameters || (parameters = {});
	method = method || (method = 'get');

	return $.ajax({
		url: getServerUrl(url), 
		data: parameters, 
		success: function(){}, 
		dataType: 'jsonp',
		type: method,
		crossDomain: true
	});

}

$(document).ready(function(){

	App = {};
	App.server_ip = '127.0.0.1:5000';

	new MainView().render();

});