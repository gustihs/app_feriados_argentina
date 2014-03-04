
Sequelize = require('sequelize');

exports.schema = function(){

	sequelize = new Sequelize('feriados', 'root', 'root', {
		dialect: 'mysql'
	});

	TiposFeriados = sequelize.define('TipoFeriado', {
		id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
		descripcion: { type: Sequelize.STRING, allowNull: false }
	},{
		tableName: 'tipos_feriados',
		underscored: true
	});

	Feriados = sequelize.define('Feriado',{
		id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
		anio: { type: Sequelize.STRING, allowNull: false },
		fecha: { type: Sequelize.STRING, allowNull: false },
		dia: { type: Sequelize.STRING, allowNull: false },
		conmemoracion: { type: Sequelize.STRING, allowNull: false }
	},{
		tableName: 'feriados',
		underscored: true
	});

	TiposFeriados.hasMany(Feriados, { as: 'Feriados'} );
	Feriados.belongsTo(TiposFeriados);

}