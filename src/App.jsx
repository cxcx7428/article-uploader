import React, { useState, useEffect } from 'react';  // 导入 React 和所需的 hooks
import ReactMarkdown from 'react-markdown';  // 导入 ReactMarkdown，用于渲染 Markdown 内容
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider
} from '@mui/material';  // 导入 Material-UI 组件
import DeleteIcon from '@mui/icons-material/Delete';  // 导入删除图标
import EditIcon from '@mui/icons-material/Edit';  // 导入编辑图标
import ThumbUpIcon from '@mui/icons-material/ThumbUp';  // 导入点赞图标

export default function ArticleUploader() {
  // useState 钩子，用于管理组件状态
  const [articles, setArticles] = useState([]);  // 文章列表
  const [title, setTitle] = useState('');  // 当前文章标题
  const [content, setContent] = useState('');  // 当前文章内容
  const [tags, setTags] = useState('');  // 当前文章标签
  const [search, setSearch] = useState('');  // 搜索框内容
  const [selectedArticle, setSelectedArticle] = useState(null);  // 选中的文章，用于全屏展示
  const [loggedIn, setLoggedIn] = useState(false);  // 登录状态
  const [isAdmin, setIsAdmin] = useState(false);  // 是否为管理员
  const [username, setUsername] = useState('');  // 当前用户名
  const [password, setPassword] = useState('');  // 当前密码
  const [registeredUsers, setRegisteredUsers] = useState({});  // 已注册的用户信息
  const [commentsMap, setCommentsMap] = useState({});  // 每篇文章的评论
  const [comment, setComment] = useState('');  // 当前评论内容
  const [editIndex, setEditIndex] = useState(null);  // 当前编辑的文章索引
  const [userLikes, setUserLikes] = useState({});  // 用户点赞记录
  const [viewingProfile, setViewingProfile] = useState(false);  // 是否查看个人资料
  const [viewingMessages, setViewingMessages] = useState(false);  // 是否查看消息
  const [messages, setMessages] = useState({});  // 消息列表
  const [recipientUsername, setRecipientUsername] = useState('');  // 收件人用户名
  const [messageContent, setMessageContent] = useState('');  // 消息内容
  const [openDialog, setOpenDialog] = useState(false);  // 控制文章对话框的显示

  // useEffect 钩子，初始化从 localStorage 中加载数据
  useEffect(() => {
    const storedArticles = localStorage.getItem('articles');
    if (storedArticles) setArticles(JSON.parse(storedArticles));

    const storedUsers = localStorage.getItem('registeredUsers');
    if (storedUsers) setRegisteredUsers(JSON.parse(storedUsers));

    const storedComments = localStorage.getItem('commentsMap');
    if (storedComments) setCommentsMap(JSON.parse(storedComments));

    const storedLikes = localStorage.getItem('userLikes');
    if (storedLikes) setUserLikes(JSON.parse(storedLikes));

    const storedMessages = localStorage.getItem('messages');
    if (storedMessages) setMessages(JSON.parse(storedMessages));
  }, []);

  // useEffect 钩子，保存数据到 localStorage
  useEffect(() => {
    localStorage.setItem('articles', JSON.stringify(articles));
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    localStorage.setItem('commentsMap', JSON.stringify(commentsMap));
    localStorage.setItem('userLikes', JSON.stringify(userLikes));
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [articles, registeredUsers, commentsMap, userLikes, messages]);

  // 文章上传或编辑处理函数
  const handleUpload = () => {
    if (!title.trim() || !content.trim()) return;  // 标题和内容不能为空
    const timestamp = new Date().toLocaleString();  // 获取当前时间戳
    if (editIndex !== null) {  // 编辑文章
      const updated = [...articles];
      if (isAdmin || updated[editIndex].author === username) {  // 管理员或文章作者可以编辑
        updated[editIndex] = {
          ...updated[editIndex],
          title,
          content,
          tags: tags.split(',').map(t => t.trim()),  // 标签以逗号分隔
          timestamp
        };
        setArticles(updated);  // 更新文章列表
      }
      setEditIndex(null);  // 清除编辑索引
    } else {  // 新增文章
      const newArticle = {
        title,
        content,
        tags: tags.split(',').map(t => t.trim()),  // 标签处理
        timestamp,
        author: loggedIn ? username : 'Guest',  // 如果已登录，作者为当前用户名
        likes: 0  // 新文章点赞数初始化为0
      };
      setArticles([newArticle, ...articles]);  // 将新文章添加到文章列表
    }
    setTitle('');  // 清空标题输入框
    setContent('');  // 清空内容输入框
    setTags('');  // 清空标签输入框
  };

  // 删除文章函数
  const handleDeleteArticle = (index) => {
    const updated = [...articles];
    const removed = updated.splice(index, 1)[0];  // 删除指定索引的文章
    setArticles(updated);  // 更新文章列表
    const newMap = { ...commentsMap };
    delete newMap[removed.title];  // 删除该文章的评论
    setCommentsMap(newMap);  // 更新评论列表
  };

  // 用户登录函数
  const handleLogin = () => {
    if (username === 'admin' && password === 'admin123') {  // 管理员登录
      setLoggedIn(true);
      setIsAdmin(true);  // 设置为管理员
    } else if (registeredUsers[username] && registeredUsers[username] === password) {  // 普通用户登录
      setLoggedIn(true);
    } else {
      alert('Invalid credentials or unregistered user');  // 登录失败提示
    }
  };

  // 用户登出函数
  const handleLogout = () => {
    setLoggedIn(false);
    setIsAdmin(false);  // 退出登录时清除管理员状态
    setUsername('');
    setPassword('');
    setViewingProfile(false);  // 清除查看个人资料状态
    setViewingMessages(false);  // 清除查看消息状态
  };

  // 用户注册函数
  const handleRegister = () => {
    if (username && password && !registeredUsers[username]) {  // 用户名和密码不能为空，且用户名不能重复
      const updated = { ...registeredUsers, [username]: password };
      setRegisteredUsers(updated);  // 更新已注册的用户列表
      alert('Registration successful');
      setLoggedIn(true);  // 注册成功后自动登录
    } else {
      alert('Invalid or duplicate username');  // 注册失败提示
    }
  };

  // 添加评论函数
  const handleAddComment = () => {
    if (comment.trim() && selectedArticle) {  // 评论不能为空且必须选择文章
      const newComment = {
        text: comment,
        author: username || 'Guest',  // 如果已登录，使用用户名，否则为 'Guest'
        timestamp: new Date().toLocaleString()  // 获取评论时间戳
      };
      const updated = { ...commentsMap };
      const key = selectedArticle.title;  // 根据文章标题作为评论的键
      updated[key] = updated[key] ? [newComment, ...updated[key]] : [newComment];
      setCommentsMap(updated);  // 更新评论列表
      setComment('');  // 清空评论输入框
    }
  };

  // 点赞文章函数
  const handleLike = (index) => {
    if (!loggedIn) return;  // 未登录不能点赞
    const article = articles[index];
    const key = `${username}_${article.title}`;  // 用户与文章唯一标识组合
    if (userLikes[key]) return;  // 如果已经点赞过，则不能重复点赞

    const updated = [...articles];
    updated[index].likes = (updated[index].likes || 0) + 1;  // 点赞数加1
    setArticles(updated);

    const updatedLikes = { ...userLikes, [key]: true };  // 更新点赞记录
    setUserLikes(updatedLikes);
  };

  // 编辑文章函数
  const handleEdit = (index) => {
    const article = articles[index];
    if (isAdmin || username === article.author) {  // 管理员或作者可以编辑
      setTitle(article.title);
      setContent(article.content);
      setTags((article.tags || []).join(', '));
      setEditIndex(index);  // 设置为编辑模式
    }
  };

  // 发送私信函数
  const handleSendMessage = () => {
    if (!recipientUsername || !messageContent) {
      alert('Both recipient and message content are required!');  // 提示填写收件人和消息内容
      return;
    }
    const newMessages = { ...messages };
    if (!newMessages[recipientUsername]) {
      newMessages[recipientUsername] = [];  // 如果没有该用户的消息记录，初始化为空数组
    }
    newMessages[recipientUsername].push({
      from: username,
      to: recipientUsername,
      text: messageContent,
      timestamp: new Date().toLocaleString(),
      read: false  // 新消息未读
    });
    setMessages(newMessages);  // 更新消息记录
    setRecipientUsername('');  // 清空收件人输入框
    setMessageContent('');  // 清空消息内容输入框
  };
  
  const userMessages = messages[username] || [];

  const userArticles = articles.filter(article => article.author === username);
  const totalLikes = userArticles.reduce((sum, article) => sum + (article.likes || 0), 0);


  // 根据 search 变量筛选文章
  const filteredArticles = articles.filter((article) => {
    return article.title.toLowerCase().includes(search.toLowerCase()) || article.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
  });

  // 渲染登录界面
  const renderLogin = () => (
    <div style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#4682b4', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
      <div style={{ backgroundColor: '#87ceeb', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '400px' }}>
        <Typography variant="h4" gutterBottom>Login</Typography>
        <TextField label="Username" fullWidth margin="normal" value={username} onChange={(e) => setUsername(e.target.value)} />
        <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button variant="contained" fullWidth onClick={handleLogin} style={{ marginTop: '1rem' }}>Login</Button>
        <Button variant="outlined" fullWidth onClick={handleRegister} style={{ marginTop: '1rem' }}>Register</Button>
      </div>
    </div>
  );

    // 文章详情对话框
  const renderArticleDialog = () => (
    selectedArticle ? (
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xl" fullWidth>
        <DialogTitle style={{ backgroundColor: '#ffffff', padding: '2rem' }}>
          <Typography variant="h4">{selectedArticle.title}</Typography>
          <Typography variant="subtitle2" color="textSecondary">By {selectedArticle.author} on {selectedArticle.timestamp}</Typography>
        </DialogTitle>
        <DialogContent style={{ backgroundColor: '#ffffff', padding: '2rem' }}>
          <ReactMarkdown>{selectedArticle.content}</ReactMarkdown>
          <Divider style={{ margin: '1rem 0' }} />
          <Typography variant="h6">Comments</Typography>
          {(commentsMap[selectedArticle.title] || []).map((c, i) => (
            <div key={i} style={{ marginBottom: '0.5rem' }}>
              <Typography variant="body2"><strong>{c.author}</strong> ({c.timestamp})</Typography>
              <Typography variant="body1">{c.text}</Typography>
            </div>
          ))}
          <TextField
            label="Add a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
            multiline
            rows={2}
            style={{ marginTop: '1rem' }}
          />
          <Button onClick={handleAddComment} variant="contained" color="primary" style={{ marginTop: '0.5rem' }}>
            Submit Comment
          </Button>
        </DialogContent>
      </Dialog>
    ) : null
  );

  // 渲染文章列表
  const renderArticleList = () => (
    <>
      {filteredArticles.map((article, index) => (
        <Card key={index} style={{ marginBottom: '1rem' }}>
          <CardContent>
            <Typography variant="h5" component="h2" style={{ cursor: 'pointer' }} onClick={() => {
              setSelectedArticle(article);
              setOpenDialog(true); // 点击文章标题时打开全屏详情
            }}>
              {article.title}
            </Typography>
            <Typography variant="body2" color="textSecondary">{article.author}</Typography>
            <Typography variant="body2" color="textSecondary">{article.timestamp}</Typography>
            <Divider style={{ margin: '1rem 0' }} />
            <div>
              <Button onClick={() => handleLike(index)} startIcon={<ThumbUpIcon />} variant="outlined">Like</Button>
              <Button onClick={() => handleEdit(index)} startIcon={<EditIcon />} variant="outlined">Edit</Button>
              <Button onClick={() => handleDeleteArticle(index)} startIcon={<DeleteIcon />} variant="outlined">Delete</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );


  const renderMainPage = () => (
    <div style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem', boxSizing: 'border-box', overflowX: 'hidden' }}>
      <div style={{ width: '100%', maxWidth: '1280px', backgroundColor: '#ffffff', color: '#1e293b', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '2rem', boxSizing: 'border-box' }}>
        {/* 页面顶部：网站标题和用户操作按钮 */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h4">Article Upload Site</Typography>
          {loggedIn && (  // 如果已登录，显示用户中心和消息按钮
            <>
              <Button onClick={() => setViewingProfile(true)}>User Center</Button>
              <Button onClick={() => setViewingMessages(true)}>Message</Button>
            </>
          )}
        </div>
  
        {/* 根据是否查看消息或个人资料来切换视图 */}
        {viewingMessages ? (
          <div>
            <Typography variant="h5">{username} 's Message Center</Typography>
            <Button onClick={() => setViewingMessages(false)} variant="outlined">Return</Button>  {/* 返回按钮 */}
            <div style={{ marginTop: '1.5rem' }}>
              {userMessages.length === 0 ? (
                <Typography>No messages</Typography>  
              ) : (
                userMessages.map((msg, index) => (  
                  <Card key={index} style={{ marginBottom: '1rem' }}>
                    <CardContent>
                      <Typography variant="h6">{msg.from} to {msg.to}</Typography>
                      <Typography variant="body2" color="textSecondary">{msg.timestamp}</Typography>
                      <Typography variant="body1">{msg.text}</Typography>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            <div>
              <TextField
                label="Recipient Username"
                value={recipientUsername}
                onChange={(e) => setRecipientUsername(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Message Content"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                fullWidth
                margin="normal"
                multiline
                rows={4}
              />
              <Button onClick={handleSendMessage} variant="contained" color="primary" style={{ marginTop: '1rem' }}>
                Send Message
              </Button>
            </div>
          </div>
        ) : (
          <>
        {/* 如果查看个人资料 */}
        {viewingProfile ? (
          <div>
            <Typography variant="h5">{username} 's User Center</Typography>
            <Typography variant="body1">Number of Article: {userArticles.length}</Typography>  {/* 显示用户文章数量 */}
            <Typography variant="body1">Likes: {totalLikes}</Typography>  {/* 显示用户的点赞数量 */}
            {userArticles.map((article, index) => (  // 显示用户发布的文章
              <Card key={index} style={{ margin: '1rem 0' }}>
                <CardContent>
                  <Typography variant="h6">{article.title}</Typography>
                  <Typography variant="body2">{article.timestamp}</Typography>
                  <Typography variant="body2">Likes: {article.likes}</Typography>
                </CardContent>
              </Card>
            ))}
            <Button onClick={() => setViewingProfile(false)} variant="outlined">Return</Button>  {/* 返回按钮 */}
          </div>
            ) : (
              <div>
                {/* 显示当前登录用户名 */}
                <Typography variant="h6" gutterBottom>
                  Logged in as: {username}
                </Typography>
                <Button onClick={handleLogout} variant="contained" color="secondary">Logout</Button>  {/* 登出按钮 */}
                {/* 文章上传表单 */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <TextField label="Article Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth margin="normal" />
                  <TextField label="Write your article here (Markdown supported)" value={content} onChange={(e) => setContent(e.target.value)} multiline rows={6} fullWidth margin="normal" />
                  <TextField label="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} fullWidth margin="normal" />
                  <Button onClick={handleUpload} variant="contained" color="primary">{editIndex !== null ? 'Update Article' : 'Upload Article'}</Button>  {/* 根据是否为编辑状态决定按钮文本 */}
                </div>
  
                {/* 文章搜索框 */}
                <TextField label="Search articles..." value={search} onChange={(e) => setSearch(e.target.value)} fullWidth margin="normal" />
  
                {/* 显示文章列表 */}
                <div style={{ marginTop: '2rem' }}>
                  {articles.filter(article => article.title.toLowerCase().includes(search.toLowerCase()) || article.content.toLowerCase().includes(search.toLowerCase())).map((article, index) => (
                    <Card key={index} style={{ marginBottom: '1.5rem' }}>
                      <CardContent>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6" style={{ cursor: 'pointer', color: '#1e88e5' }} onClick={() => { setSelectedArticle(article); setOpenDialog(true); }}>
                            {article.title}
                          </Typography>
                          <div>
                            {/* 点赞、编辑和删除按钮 */}
                            <IconButton onClick={() => handleLike(index)}><ThumbUpIcon color="primary" /></IconButton>
                            {(isAdmin || username === article.author) && (  // 管理员或作者可以编辑
                              <IconButton onClick={() => handleEdit(index)}><EditIcon color="action" /></IconButton>
                            )}
                            {isAdmin && (  // 只有管理员可以删除
                              <IconButton onClick={() => handleDeleteArticle(index)}><DeleteIcon color="error" /></IconButton>
                            )}
                          </div>
                        </div>
                        {/* 文章的附加信息 */}
                        <Typography variant="body2" color="textSecondary">
                          Uploaded by: {article.author} at {article.timestamp}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Likes: {article.likes || 0} | Tags: {(article.tags || []).join(', ')}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
  <>
    {loggedIn ? renderMainPage() : renderLogin()}  
    {renderArticleDialog()}  
  </>
  );
}
