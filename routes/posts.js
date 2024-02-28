const express = require('express');
const Post = require('../models/Post');
const router = express.Router();
const authenticateToken = require('../authenticateToken');

// 获取所有帖子
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username');
        const postWithLikes = await Promise.all(posts.map(async post => {
          const likes = await Like.find({ post: post._id }).populate('user', 'username');
          return {
            ...post.toObject(),
            likesCount: likes.length,
            likedBy: likes.map(like => like.user.username)
          };
        }));
        res.json(postWithLikes);
    } catch (err) {
    res.status(500).json({ message: err.message });
    }
});

// 获取单个帖子的详情
router.get('/:id', async (req, res) => {
    // console.log(req.params.id);
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username');
        if (post == null) {
            return res.status(404).json({ message: 'Cannot find post' });
        }
        res.json(post);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    console.log(req.user); // 確認用戶的資訊
    const post = new Post({
        content: req.body.content,
        author: req.user.userId,
    });
    // 切記author不是req.user._id而是req.user.userId
    // console.log(req.user.userId);
    console.log(post); // 查看post的內容
    try {
        const newPost = await post.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 更新帖子
router.patch('/:id', authenticateToken, getPost, async (req, res) => {
    console.log(req);
    if (req.body.content != null) {
        res.post.content = req.body.content;
    }
    try {
        const updatedPost = await res.post.save();
        res.json(updatedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
  
  // 中间件来查找帖子并验证用户是否为帖子的作者
async function getPost(req, res, next) {
    // console.log(req);
    let post;
    try {
      post = await Post.findById(req.params.id);
      if (post == null) {
        return res.status(404).json({ message: 'Cannot find post' });
      }
      if (post.author.toString() !== req.user.userId) {
        return res.status(401).json({ message: 'Not authorized to edit this post' });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  
    res.post = post;
    next();
}


// 删除Post
router.delete('/:id', authenticateToken, getPost, async (req, res) => {
    try {
      await Post.deleteOne({ _id: res.post._id });
      res.json({ message: 'Deleted Post' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});



module.exports = router;
