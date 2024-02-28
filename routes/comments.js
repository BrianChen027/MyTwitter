const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Like = require('../models/Like');
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

// 获取特定帖子的所有评论
router.get('/post/:postId', async (req, res) => {
    try {
        // console.log(req.params);
        const comments = await Comment.find({ post: req.params.postId }).populate('author', 'username');
        // console.log(comments);
        const commentsWithLikes = await Promise.all(comments.map(async comment => {
          const likes = await Like.find({ comment: comment._id }).populate('user', 'username');
          return {
            ...comment.toObject(),
            likesCount: likes.length,
            likedBy: likes.map(like => like.user.username)
          };
        }));
        res.json(commentsWithLikes);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
});

module.exports = router;
