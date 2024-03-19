const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { generateAccessToken, generateRefreshToken, token } = require('../helpers/generateToken');
const deleteFile = require("../helpers/deleteFile");

const store = async (req, res) => {

  // Megtekint mongoos-al hogy a felhasználó létezik-e email cím alapján, ha igen akkor error

  const { userName, email, password } = req.body;
  const saltRounds = 10;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name: userName,
      email: email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log('New user stored', savedUser);
  } catch (error) {
    console.error('Something went wrong when the user is stored', error);
  }

}

const login = async (req, res) => {
  try {
    // Ellenőrizzük, hogy a felhasználó létezik-e az adatbázisban az e-mail cím alapján
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User doesn't exist in user.controller.login",
      });
    }

    // Ellenőrizzük a jelszót
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        status: false,
        message: "Wrong password in user.controller.login->passwordMatch",
      });
    }

    // Ha minden stimmel, generálunk egy refresh token-t és egy access token-t
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, // Csak HTTPS-en keresztül engedélyezett
      maxAge: 24 * 60 * 60 * 1000 // 1 nap
    });


    res.status(200).json({
      status: 'success',
      data: {
        accessToken,
        refreshToken
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }


};

const index = async (req, res) => {
  const { user } = req;


  if (!user) {
    return res.status(404).json({
      status: false,
      message: "User is doesn't exist in user.controller.index",
    });
  }

  return res.status(200).json({
    status: true,
    data: user,
  });
}




const test = async (req, res) => {
  res.send('Hello user!');
}

module.exports = {
  store,
  login,
  test,
  index,
}