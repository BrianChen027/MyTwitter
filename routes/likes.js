const express = require('express');
const router = express.Router();
const Like = require('../models/Like');
const authenticateToken = require('../authenticateToken');

// Post like
router.post('/post/:postId', authenticateToken, async (req, res) => {
  const alreadyLiked = await Like.findOne({ user: req.user.userId, post: req.params.postId });
  if (alreadyLiked) {
    return res.status(400).json({ message: "You've already liked this post." });
  }
  const like = new Like({
    user: req.user.userId,
    post: req.params.postId,
  });
  try {
    const newLike = await like.save();
    res.status(201).json(newLike);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 取消Post的Like
router.delete('/post/:postId', authenticateToken, async (req, res) => {
    try {
      const like = await Like.findOneAndDelete({ user: req.user.userId, post: req.params.postId });
      if (!like) {
        return res.status(404).json({ message: "User does not post like before" });
      }
      res.json({ message: "Remove te" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});

// 評論的Like
router.post('/comment/:commentId', authenticateToken, async (req, res) => {
    const alreadyLiked = await Like.findOne({ user: req.user.userId, comment: req.params.commentId });
    if (alreadyLiked) {
      return res.status(400).json({ message: "You've already liked this comment." });
    }
    const like = new Like({
      user: req.user.userId,
      comment: req.params.commentId,
    });
    try {
      const newLike = await like.save();
      res.status(201).json(newLike);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
});
  
// 取消評論的Like
router.delete('/comment/:commentId', authenticateToken, async (req, res) => {
    try {
      const like = await Like.findOneAndDelete({ user: req.user.userId, comment: req.params.commentId });
      if (!like) {
        return res.status(404).json({ message: "Like not found." });
      }
      res.json({ message: "Like removed." });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});
  
module.exports = router;
