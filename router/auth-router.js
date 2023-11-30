const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  editUserById,
  deleteUserById,
  login,
} = require("../controllers/auth-controller");
const signupSchema = require("../validators/auth-validators");
const validate = require("../middlewares/validate-middleware");

// Register a new user or get all users
router.route("/user").post(validate(signupSchema), createUser);

// Get all users or perform other actions on all users
router.route("/users").get(getAllUsers);
router.route("/login").post(login);

// Get, update, or delete a specific user by ID
router
  .route("/users/:id")
  .get(getUserById)
  .put(editUserById)
  .delete(deleteUserById);

module.exports = router;
