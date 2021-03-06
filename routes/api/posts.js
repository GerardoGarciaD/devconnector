const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

// Se obtienen los modelos de datos
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Se obtiene el usuario mediante el id que se recibe de token
      const user = await User.findById(req.user.id).select("-password");

      //   Se utiliza el modelo de datos Post para guardar la informacion que se manda en el request
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: user.id
      });

      //   Se guarda el post en la base de datos
      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET api/posts
// @desc    Get all post
// @access  Private

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/posts/:post_id
// @desc    Get post by ID
// @access  Private

router.get("/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/posts/:post_id
// @desc    DELETE post by ID
// @access  Private

router.delete("/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // Verificar si el usuario que desea eliminar el post es el "dueño"
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // Eliminar el post si el usuario es el dueño
    await post.remove();

    res.json({ msg: "Post Removed" });

    res.json(post);
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/posts/like/:post_id
// @desc    Like a post
// @access  Private

router.put("/like/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    //   Verificar si el usuario ya dio like a este post
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/posts/unlike/:post_id
// @desc    Unlike a post
// @access  Private

router.put("/unlike/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    //   Verificar si el usuario ya dio like a este post
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: "Post has not been liked yet" });
    }

    // Se ibtiene el id del usuario que le dio like al post
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);

    // Se elimina el "like" del array con el indice encontrado
    post.likes.splice(removeIndex, 1);
    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/posts/comment/:post_id
// @desc    Comment on a post
// @access  Private

router.post(
  "/comment/:post_id",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // Se verifica que no haya errores con los campos requeridos
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Se obtiene el usuario mediante el id que se recibe del token y se quita la contraseña
      const user = await User.findById(req.user.id).select("-password");
      // se obtiene el opst con el id que se manda desde la URL
      const post = await Post.findById(req.params.post_id);

      // Se crea un nuevo objeto que contiene la informacion del comentario
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: user.id
      };

      // Se añade el objeto creado al principio del array
      post.comments.unshift(newComment);
      //   Se guarda el post en la base de datos
      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   PUT api/posts/comment/:post_id/:comment_id
// @desc    Delete a comment
// @access  Private

router.delete("/comment/:post_id/:comment_id", auth, async (req, res) => {
  try {
    // Se obtiene el post mediante el id que se pasa en la URL (se utiliza el modelo de datos POST)
    const post = await Post.findById(req.params.post_id);

    // Se busca el comentario a eliminar (si es que existe) mediante el id del comentario que se manda desde la URL
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );

    // Verificar que el comentario existe
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exists" });
    }

    // Verificar que quien desea eliminar el comentario sea el "dueño"

    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // Se obtiene el id del usuario que le dio like al post
    const removeIndex = post.comments
      .map(comment => comment.user.toString())
      .indexOf(req.user.id);

    // Se elimina el comentario del array con el indice encontrado
    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
