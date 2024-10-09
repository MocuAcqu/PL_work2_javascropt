const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// 建立 Express 應用
const app = express();
const port = 5000; // 後端伺服器的埠號

// 中介軟體
app.use(cors());
app.use(bodyParser.json());

// 使用 mongoose 連接 MongoDB Atlas
mongoose.connect('mongodb+srv://a0901422997:CFvpDIqwsdIW9f0L@cluster0.mongodb.net/commentApp?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// 定義留言的 Schema 和 Model
const postSchema = new mongoose.Schema({
  name: String,
  content: String,
  date: String,
  likes: { type: Number, default: 0 }
});

const Post = mongoose.model('Post', postSchema);

// API 路由

// 新增留言
app.post('/api/posts', async (req, res) => {
  const { name, content, date } = req.body;
  const newPost = new Post({ name, content, date });
  await newPost.save();
  res.status(201).json(newPost);
});

// 獲取所有留言
app.get('/api/posts', async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

// 更新按讚數
app.put('/api/posts/:id/like', async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  post.likes += 1;
  await post.save();
  res.json(post);
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
