const express = require("express");
const Producto = require("./Modelos/Productos");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());


//Obtiene una lista de productos
app.get("/productos", async (req, res) => {
  try {
    const productos = await Producto.findAll({
      order: [["id_producto", "DESC"]],
    });
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener productos" });
  }
});

//Crea un nuevo producto.
app.post("/productos", async (req, res) => {
  try {
    const { nombre, descripcion, precio, estado, categoria, url_fotografia } = req.body;

    if (!nombre || precio === undefined || !estado || !categoria) {
      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios",
      });
    }

    const nuevo = await Producto.create({
      nombre,
      descripcion,
      precio,
      estado,
      categoria,
      url_fotografia,
    });

    res.status(201).json({
      mensaje: "Producto creado",
      producto: nuevo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear producto" });
  }
});

//Elimina un producto por ID
app.delete("/productos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    await producto.destroy();

    res.json({ mensaje: "Producto eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al eliminar producto" });
  }
});


app.listen(5000, () => {
  console.log("Aplicacion ejecutando en puerto 5000");
});