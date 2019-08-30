const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private

router.get("/me", auth, async (req, res) => {
  try {
    // Aqui se busca si es que existe el perfil del usuario que se manda como request, de que tambien se obtiene
    // la informacion del nombre y el avatar del usuario con la funcion .populate
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private

router.post(
  "/",
  [
    auth,
    [
      // Se verifican que estos campos existan
      check("status", "Status is required")
        .not()
        .isEmpty(),
      check("skills", "Skills are required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Se hace object destructuring de la informacion que se obtiene del body del request
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    // Build profile object
    // Aqui se crea un objeto en blanco que contendrá la informacion que se creara o actualizará del perfil del  usuario
    const profileFields = {};

    // aqui se guarda el id del usuario que se manda como req y que se obtiene desde la confirmacion del token del archivo auth.js
    profileFields.user = req.user.id;
    // Depues se guarda toda la informacion (si esta fue añadida al body del req)
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    // Aqui se separan las habiliades por coma y se les quita el espacio
    if (skills) {
      profileFields.skills = skills.split(",").map(skill => skill.trim());
    }

    // Build social object
    // Se añade un otro objeto al objeto profileFields, en donde se guardarán toda la informacion de las redes sociales del usuario
    profileFields.social = {};

    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      /* TODAS LAS ACCIONES QUE NECESITEN DE HACER UNA LLAMADA A LA BASE DE DATOS  (findOne, findOneAndUpdate, save) SE UTILIZA await POR QUE REGRESAN 
      UNA PROMESA */
      // Se busca si el perfil del usuario ya existe
      let profile = await Profile.findOne({ user: req.user.id });

      // Si existe, se actualiza la informacion del perfil
      if (profile) {
        //   Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      //Create

      // Si no existe, crea un nuevo perfil con le modelo de datos Profile y se guarda a la base de datos
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
