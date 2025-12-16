const {Sequelize}= require('sequelize')

const sequelize= new Sequelize(
    'productosMovil',
    'Kevin',
    'Alejandra2731**',
    {
        host:'localhost',
        port:3306,
        dialect:'mysql'
    }
)

sequelize.authenticate()
        .then(()=> console.log('Conexión establecida correctamente...'))
        .catch((error)=> console.log('ocurrio un error'));

module.exports=sequelize;