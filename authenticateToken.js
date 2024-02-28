const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  // 从请求头中获取token
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) {
    return res.sendStatus(401); // 如果没有token，返回401未授权
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // 如果token无效，返回403禁止访问
    }
    req.user = user; // 将解码后的用户信息添加到请求对象中
    next(); // 调用next()继续执行后续中间件
  });
}

module.exports = authenticateToken;
