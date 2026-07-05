const pool = require("./db");

const prepararHATEOAS = (joyas) => {
  const results = joyas.map((joya) => ({
    name: joya.nombre,
    href: `/joyas/joya/${joya.id}`,
  }));

  const totalJoyas = joyas.length;
  const stockTotal = joyas.reduce((total, joya) => total + joya.stock, 0);

  return {
    totalJoyas,
    stockTotal,
    results,
  };
};

const obtenerJoyas = async ({ limits = 5, page = 1, order_by = "id_ASC" }) => {

  // Convertir a número
  limits = Number(limits);
  page = Number(page);

  // Validar parámetros
  if (limits <= 0 || page <= 0) {
    throw new Error("Los parámetros limits y page deben ser mayores que cero.");
  }

  const [campo, direccion] = order_by.split("_");

  const camposPermitidos = [
    "id",
    "nombre",
    "categoria",
    "metal",
    "precio",
    "stock",
  ];

  const direccionesPermitidas = ["ASC", "DESC"];

  if (
    !camposPermitidos.includes(campo) ||
    !direccionesPermitidas.includes(direccion)
  ) {
    throw new Error("Parámetro order_by no permitido");
  }

  const offset = (page - 1) * limits;

  const consulta = `
    SELECT *
    FROM inventario
    ORDER BY ${campo} ${direccion}
    LIMIT $1 OFFSET $2
  `;

  const { rows } = await pool.query(consulta, [limits, offset]);

  return prepararHATEOAS(rows);
};

const filtrarJoyas = async ({
  precio_min,
  precio_max,
  categoria,
  metal,
}) => {

  let filtros = [];
  let values = [];

  if (precio_min) {
    values.push(precio_min);
    filtros.push(`precio >= $${values.length}`);
  }

  if (precio_max) {
    values.push(precio_max);
    filtros.push(`precio <= $${values.length}`);
  }

  if (categoria) {
    values.push(categoria);
    filtros.push(`categoria = $${values.length}`);
  }

  if (metal) {
    values.push(metal);
    filtros.push(`metal = $${values.length}`);
  }

  let consulta = "SELECT * FROM inventario";

  if (filtros.length > 0) {
    consulta += ` WHERE ${filtros.join(" AND ")}`;
  }

  const { rows } = await pool.query(consulta, values);

  return rows;
};

module.exports = {
  obtenerJoyas,
  filtrarJoyas,
};