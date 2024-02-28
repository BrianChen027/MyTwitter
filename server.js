require('dotenv').config(); // 加载.env文件中的环境变量

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 引入路由
const usersRouter = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRouter = require('./routes/comments');
const likesRouter = require('./routes/likes');

const app = express();
const port = process.env.PORT || 3001;

// 中间件
app.use(cors()); // 允许跨域请求
app.use(express.json()); // 解析JSON请求体
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRouter);
app.use('/api/likes', likesRouter);

// 数据库连接（示例使用MongoDB）
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to database!'))
.catch(err => console.error('Could not connect to database', err));

// 使用路由
app.use('/api/users', usersRouter);

// 基本路由
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});