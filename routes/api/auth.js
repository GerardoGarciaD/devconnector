const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");
// Se importan estas funciones para validar la informacion que se manda en los request
const { check, validationResult } = require("express-validator/check");

// @route   GET api/auth
// @desc    Test route
// @access  Public

// Se utiliza el middleware auth para poder "asegurar" esta ruta
router.get("/", auth, async (req, res) => {
  try {
    // Se crea el objeto user en donde se obtiene el usuario mediante el id que se obtiene del request pero no se obtiene la contraseña
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post(
  "/",
  //   Se agrega como segundo parametro un array en donde se verifican los campos que se mandan en el request post
  [
    // Se verifican los campos con la funcion check

    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists()
  ],

  //   Se realiza una callback function en donde se ejecutan acciones para los usuarios
  async (req, res) => {
    // Despues se obtienen los resultados de las validaciones
    const errors = validationResult(req);
    // Si existen erroes al momento de hacer las validaciones, entonces se regresa un status 400 (bad request)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Se hace destructuring de el cuerpo del request
    const { email, password } = req.body;

    try {
      // Verificar si el usuario ya existe en la BD

      //   Se utiliza findOne para verificar si es que existe un usuario con el correo que se manda en la request
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      // Se comparan la contraseña que se manda como request con la encriptada
      const isMatch = await bcrypt.compare(password, user.password);

      // Si no coinciden se manda el error
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      //   Se obtiene el id del usuario logueado
      const payload = {
        user: {
          id: user.id
        }
      };

      // Se utiliza la funcion.sign de jsonwebtoken, en donde se pasa el payload, que en este caso contiene el id del usuario logueado
      jwt.sign(
        //   Se pasa el payload, la llave "secreta" y el tiempo en el que expira el token
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },

        // Despues se realiza una callback function con lo que se regresa, que puede ser un error o el token
        //   este token contiene la informacion encriptada y puede ser leeida en la pagina https://jwt.io/
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("server error");
    }
  }
);

module.exports = router;
