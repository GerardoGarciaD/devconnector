const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

// Se importan estas funciones para validar la informacion que se manda en los request
const { check, validationResult } = require("express-validator/check");

const User = require("../../models/User");

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  "/",
  //   Se agrega como segundo parametro un array en donde se verifican los campos que se mandan en el request post
  [
    // Se verifican los campos con la funcion check
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Pleae enter a password with 6 or more characters"
    ).isLength({ min: 6 })
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
    const { name, email, password } = req.body;

    try {
      // Verificar si el usuario ya existe en la BD

      //   Se utiliza findOne para verificar si es que existe un usuario con el correo que se manda en la request
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
      // Obtener users gravatar

      //   Si no existe el usuario en la base de datos se crea el avatar del usuario (imagen)
      const avatar = gravatar.url(email, {
        // tamaño de la imagen
        s: "200",
        // Rating de la imagen,
        r: "pg",
        // Image por default
        d: "mm"
      });

      //   Se crea el nuevo usuario con el Modelo que se importa
      user = new User({
        name,
        email,
        avatar,
        password
      });
      // Encriptar la contraseña

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      //   Se guarda el usuario en la base de datos
      await user.save();

      // Return jsonwebtoken

      //   Se obtiene el id del usuario recien registrado
      const payload = {
        user: {
          id: user.id
        }
      };

      // Se utiliza la funcion.sign de jsonwebtoken, en donde se pasa el payload, que en este caso contiene el id del usuario recien registrado
      jwt.sign(
        //   Se pasa el payload, la llave "secreta" y el tiempo en el que expira el token
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },

        // Despues se realiza una callback function con lo que se regresa, que puede ser un error o el token
        //   este token contiene la informacion encriptada
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
