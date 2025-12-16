const { DataTypes } = require("sequelize");
const sequelize = require("../Conexion/database");

const Producto = sequelize.define(
  'Producto',
  {
    id_producto: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    estado: {
      type: DataTypes.ENUM('Disponible', 'No Disponible'),
      allowNull: false,
    },

    categoria: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    url_fotografia: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: 'productos',
    timestamps: false
  }
);

module.exports=Producto;