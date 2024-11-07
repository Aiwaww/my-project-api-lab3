const { User } = require('../db/user');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const { JWT_SECRET } = require('../config');
class AuthController {
  static async register(req, res, next) {
    try {
      const { email, password } = req.body;

      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        email,
        password: hashedPassword,
      });

      const createdUser = await user.save();

      const token = jwt.sign(
        { userId: createdUser._id, email: user.email },
        JWT_SECRET,
        {
          expiresIn: '30d',
        }
      );
      console.log(createdUser);
      await User.findByIdAndUpdate(createdUser._id, { token });
      res.status(201).json({ data: { email, token } });
    } catch (e) {
      console.log('Error:', e);
      next(e);
    }
  }
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: '30d' }
      );
      user.token = token;
      await user.save();

      res.status(200).json({ message: 'Login successful', token });
    } catch (e) {
      console.log('Error:', e);
      next(e);
    }
  }
  static async current(req, res, next) {
    try {
      const { userId } = req.user;

      const user = await User.findById(userId);

      if (!user) {
        res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ data: { token: user.token } });
    } catch (e) {
      console.log('Error:', e);
      next(e);
    }
  }
  static async logout(req, res, next) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      user.token = null;
      await user.save();

      res.json({ message: 'Logout successful' });
    } catch (e) {
      console.log('Error:', e);
      next(e);
    }
  }
}
module.exports = AuthController;
