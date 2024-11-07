// routes/index.js
const express = require('express');
const AuthController = require('../controllers/auth');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Define routes
router.get(
  '/current',
  async (req, res, next) => {
    try {
      const { authorization, Authorization } = req.headers;
      const authHeader = authorization || Authorization;
      const token = authHeader?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'Token required' });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;

      next();
    } catch (e) {
      console.error('Error', e);
      res.status(401).json({ message: 'Unauthorized' });
    }
  },
  AuthController.current
);

router.post('/login', AuthController.login);

router.post('/register', AuthController.register);

router.post('/logout', AuthController.logout);

module.exports = router;
