const User = require("../models/user-model");
const mongoose = require("mongoose");

const createUser = async (req, res) => {
  try {
    // Check if the email already exists
    const { username, email, phone, password } = req.body;
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      // Email is already in use, send an error response
      return res.status(400).send({
        error: {
          name: "ValidationError",
          message: "Email is already in use",
          errors: {
            email: "Email is already in use",
          },
        },
      });
    }

    // If email is not in use, create the new user
    const userCreated = await User.create({ username, email, phone, password });

    // res.status(201).json({ message: "User registered successfully" });
    res.status(201).json({
      msg: "Registration Successful",
      token: await userCreated.generateToken(),
      userId: userCreated._id.toString(),
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      // If it's a validation error, extract relevant information
      const validationErrors = {};
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }

      res.status(400).send({
        error: {
          name: error.name,
          message: "Validation error",
          errors: validationErrors,
        },
      });
    } else {
      // For other types of errors, send a general error response
      res.status(500).send({ error: error.message });
    }
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    res.send({
      data: allUsers,
    });
  } catch (error) {
    res.status(400).send({
      data: error,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id; // Assuming the user ID is provided as a route parameter
    console.log(userId);
    // Check if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({
        error: {
          name: "CastError",
          message: "Invalid user ID",
        },
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({
        error: {
          name: "NotFoundError",
          message: "User not found",
        },
      });
    }

    res.send({
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      error: {
        name: error.name,
        message: error.message,
      },
    });
  }
};

const editUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({
        error: {
          name: "CastError",
          message: "Invalid user ID",
        },
      });
    }

    // Find the user by ID and update their information
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      req.body,
      { new: true, runValidators: true } // Return the updated user and run validators
    );

    if (!updatedUser) {
      return res.status(404).send({
        error: {
          name: "NotFoundError",
          message: "User not found",
        },
      });
    }

    res.send({
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).send({
      error: {
        name: error.name,
        message: error.message,
      },
    });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({
        error: {
          name: "CastError",
          message: "Invalid user ID",
        },
      });
    }

    // Find the user by ID and delete them
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).send({
        error: {
          name: "NotFoundError",
          message: "User not found",
        },
      });
    }

    res.send({
      data: deletedUser,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      error: {
        name: error.name,
        message: error.message,
      },
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // const user = await bcrypt.compare(password, userExist.password);
    const isPasswordValid = await userExist.comparePassword(password);

    if (isPasswordValid) {
      res.status(200).json({
        message: "Login Successful",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password " });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  editUserById,
  deleteUserById,
  login,
};
