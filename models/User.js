const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // 你可以根據需要添加更多字段，例如email, createdAt等
});


module.exports = mongoose.model('User', userSchema);
