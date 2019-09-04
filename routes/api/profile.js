const express = require("express");
const router = express.Router();
const request = require("request");
const config = require("config");
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");
const { check, validationResult } = require("express-validator");

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private

router.get("/me", auth, async (req, res) => {
  try {
    // Aqui se busca si es que existe el perfil del usuario que se manda como request, de que tambien se obtiene
    // la informacion del nombre y el avatar del usuario (mediante el modelo de datos User) con la funcion .populate
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    res.json(profile);

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

      // Si no existe, crea un nuevo perfil con el modelo de datos Profile y se guarda a la base de datos
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   POST api/profile
// @desc    Get all profiles
// @access  Public

router.get("/", async (req, res) => {
  try {
    // Se obtienen todos los perfiles
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);

    res.json(profiles);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/profile/user/:user_id
// @desc    Get profile by user Id
// @access  Public

// : user_id es el parametro que se pone en la url para obtener el perfil del usuario
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      // Aqui se obtiene el parametro del url
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);

    if (!profile) return res.status(400).json({ msg: "Profile not found" });

    res.json(profile);
  } catch (err) {
    console.log(err.message);

    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/profile
// @desc    Delete profile, user & posts
// @access  Private

router.delete("/", auth, async (req, res) => {
  try {
    // Elilminar posts del usuario
    await Post.deleteMany({ user: req.user.id });

    // Eliminar perfil
    await Profile.findOneAndRemove({ user: req.user.id });

    // Eliminar usuario
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required")
        .not()
        .isEmpty()
    ],
    [
      check("company", "Company is required")
        .not()
        .isEmpty()
    ],
    [
      check("from", "From date is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Se obtiene la informacion del body req mediante object destructuring
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    // Se guarda la informacion en este objeto
    const newExp = {
      // title:title es lo mismo que solamente poner title
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      // Se obtiene el perfil del usuario (mediante el token)
      const profile = await Profile.findOne({ user: req.user.id });

      // Se guarda el objeto newExp en el campo experience del perfil, se utiliza unshift para guardarlo al principio de la lista
      profile.experience.unshift(newExp);

      // Finalmente se guarda el perfil en la base de dtos
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.sta + (500).send("Server Error");
    }
  }
);

// @route   PUT api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    // Se obtiene el perfil del usuario (mediante el token)
    const profile = await Profile.findOne({ user: req.user.id });

    // Se obtiene la experiencia a eliminar (id de la experiencia)
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/profile/education
// @desc    Add profile education
// @access  Private

router.put(
  "/education",
  [
    auth,
    [
      check("school", "school is required")
        .not()
        .isEmpty()
    ],
    [
      check("degree", "Degree is required")
        .not()
        .isEmpty()
    ],
    [
      check("fieldofstudy", "Field of study date is required")
        .not()
        .isEmpty()
    ],
    [
      check("from", "From of study date is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Se obtiene la informacion del body req mediante object destructuring
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    // Se guarda la informacion en este objeto
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      // Se obtiene el perfil del usuario (mediante el token)
      const profile = await Profile.findOne({ user: req.user.id });

      // Se guarda el objeto newExp en el campo experience del perfil, se utiliza unshift para guardarlo al principio de la lista
      profile.education.unshift(newEdu);

      // Finalmente se guarda el perfil en la base de dtos
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.log(err.message);
      res.sta + (500).send("Server Error");
    }
  }
);

// @route   PUT api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    // Se obtiene el perfil del usuario (mediante el token)
    const profile = await Profile.findOne({ user: req.user.id });

    // Se obtiene la experiencia a eliminar (id del historial academico)
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);

    // Se elimina el indice encontrado
    profile.education.splice(removeIndex, 1);
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/profile/github/:username
// @desc    Get user repos
// @access  Public

router.get("/github/:username", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" }
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: "No Github profile found" });
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
