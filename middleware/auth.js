const jwt = require("jsonwebtoken");
const config = require("config");

// Esto es una middleware funtion que se encarga de verificar si existe un token y si es valido, esto es para permitir o denegar el acceso a las rutas (protegidas)
module.exports = function(req, res, next) {
  // Obtener el token del header
  const token = req.header("x-auth-token");

  // Verificar si no existe el token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verificacion del token
  try {
    //   Se verifica el token con la llave "secreta" que se obtiene  desde  default.json
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    // despues se actualiza el usuario del request con el usuario decodificado
    req.user = decoded.user;
    // por ultimo se utiliza next, para poder seguir con el siguiente middleware o el siguiente paso
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
