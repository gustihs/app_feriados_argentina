
FeriadoListadoView = Backbone.View.extend({

	el: '#main_content',

	initialize: function(titulo, year){
		titulo = titulo.titulo;
		this.collection = new Backbone.Collection;
		var self = this;
		this.collection.url = getServerUrl('feriados/'+titulo.id+'/'+ year);

		this.collection.on('add', function(model, collection){
			var row = '<ul class="lista_feriados" data-role="listview" id="lista_'+model.get('id')+'">';
			row += '<li>'+model.get('fecha')+'</li>';
			row += '<li>'+model.get('dia')+'</li>';
			row += '<li>'+model.get('conmemoracion')+'</li>';
			row += '</ul>';

			$('#titulo_'+titulo.id).append(row);
			$('#lista_'+model.get('id')).listview();
		});

		this.tpl = '<h3 class="titular">'+titulo.descripcion+'</h3>';	
		this.tpl += '<div id="titulo_'+titulo.id+'"></div>';

		return this;
	},
	render: function(){		
		this.collection.fetch({dataType: 'jsonp'});
		return this.tpl;
	}

});


MainView = Backbone.View.extend({

	el: '#main_content',

	initialize: function(){		
		var self = this;

		$('#cambiar_anio').on('change', function(){
			self.render($(this).val());
		});

		return this;

	},
	render: function(year){
		var self = this;
		self.$el.html('');

		this.getTipos(function(titulos){
			for(var index in titulos){
				var view = new FeriadoListadoView({ titulo: titulos[index] }, year);
				self.$el.append(view.render());
			}			
		});
	},
	getTipos: function(callback){
		doRequest('titulos').success(function(titulos){
			callback(titulos);
		}).error(function(error){
			console.log(error);
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
	var env = 'prod';

	if(env == 'prod'){
		App.server_ip = '54.201.7.254';
	}else{
		App.server_ip = '127.0.0.1:5000';
	}	

	new MainView().render($('#cambiar_anio').val());

});