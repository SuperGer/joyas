const express = require("express");
require("dotenv").config();

const { obtenerJoyas, filtrarJoyas } = require("./consultas");
const { reportarConsulta } = require("./middlewares");

const app = express();

app.use(express.json());

// Middleware
app.use(reportarConsulta);

// Ruta de inicio
app.get("/", (req, res) => {
  res.send("API Tienda de Joyas funcionando");
});

// GET /joyas
app.get("/joyas", async (req, res) => {
  try {
    const joyas = await obtenerJoyas(req.query);
    res.json(joyas);
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
});

// GET /joyas/filtros
app.get("/joyas/filtros", async (req, res) => {
  try {
    const joyas = await filtrarJoyas(req.query);
    res.json(joyas);
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});