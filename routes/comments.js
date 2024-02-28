const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const authenticateToken = require('../authenticateToken');

// 发表评论
router.post('/', authenticateToken, async (req, res) => {
    console.log(req.user.userId);
  const comment = new Comment({
    content: req.body.content,
    author: req.user.userId,
    post: req.body.post,
  });
  try {
    const newComment = await comment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
