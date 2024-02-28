const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const authenticateToken = require('../authenticateToken'); 

const router = express.Router();

const jwt = require('jsonwebtoken');

router.get('/myinfo', authenticateToken, (req, res) => {
  // 只有验证通过的请求才会运行这里的代码
  res.json({ userInfo: req.user });
});

// Register User info
router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
    });
    const savedUser = await user.save();
    res.status(201).send(savedUser);
  } catch (error) {
    res.status(500).send(error);
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      // 创建JWT token
      const token = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET, // 确保在环境变量中设置了JWT_SECRET
        { expiresIn: '24h' }
      );
      res.json({ accessToken: token });
    } else {
      res.status(400).send('Invalid credentials');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
