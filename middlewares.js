const reportarConsulta = (req, res, next) => {
  const fecha = new Date().toLocaleString();

  console.log("======================================");
  console.log(`Fecha: ${fecha}`);
  console.log(`Método: ${req.method}`);
  console.log(`Ruta: ${req.originalUrl}`);
  console.log("======================================");

  next();
};

module.exports = {
  reportarConsulta,
};