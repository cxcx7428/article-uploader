import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

export default function ArticleUploader() {
  const [articles, setArticles] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [search, setSearch] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState({});
  const [commentsMap, setCommentsMap] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const [userLikes, setUserLikes] = useState({});
  const [viewingProfile, setViewingProfile] = useState(false);
  const [viewingMessages, setViewingMessages] = useState(false);
  const [messages, setMessages] = useState({});  // Store messages by user
  const [recipientUsername, setRecipientUsername] = useState('');  // Input for recipient
  const [messageContent, setMessageContent] = useState('');  // Input for message content

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

  useEffect(() => {
    localStorage.setItem('articles', JSON.stringify(articles));
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    localStorage.setItem('commentsMap', JSON.stringify(commentsMap));
    localStorage.setItem('userLikes', JSON.stringify(userLikes));
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [articles, registeredUsers, commentsMap, userLikes, messages]);

  const handleUpload = () => {
    if (!title.trim() || !content.trim()) return;
    const timestamp = new Date().toLocaleString();
    if (editIndex !== null) {
      const updated = [...articles];
      if (isAdmin || updated[editIndex].author === username) {
        updated[editIndex] = {
          ...updated[editIndex],
          title,
          content,
          tags: tags.split(',').map(t => t.trim()),
          timestamp
        };
        setArticles(updated);
      }
      setEditIndex(null);
    } else {
      const newArticle = {
        title,
        content,
        tags: tags.split(',').map(t => t.trim()),
        timestamp,
        author: loggedIn ? username : 'Guest',
        likes: 0
      };
      setArticles([newArticle, ...articles]);
    }
    setTitle('');
    setContent('');
    setTags('');
  };

  const handleDeleteArticle = (index) => {
    const updated = [...articles];
    const removed = updated.splice(index, 1)[0];
    setArticles(updated);
    const newMap = { ...commentsMap };
    delete newMap[removed.title];
    setCommentsMap(newMap);
  };

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin123') {
      setLoggedIn(true);
      setIsAdmin(true);
    } else if (registeredUsers[username] && registeredUsers[username] === password) {
      setLoggedIn(true);
    } else {
      alert('Invalid credentials or unregistered user');
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setIsAdmin(false);
    setUsername('');
    setPassword('');
    setViewingProfile(false);
    setViewingMessages(false);
  };

  const handleRegister = () => {
    if (username && password && !registeredUsers[username]) {
      const updated = { ...registeredUsers, [username]: password };
      setRegisteredUsers(updated);
      alert('Registration successful');
      setLoggedIn(true);
    } else {
      alert('Invalid or duplicate username');
    }
  };

  const handleAddComment = () => {
    if (comment.trim() && selectedArticle) {
      const newComment = {
        text: comment,
        author: username || 'Guest',
        timestamp: new Date().toLocaleString()
      };
      const updated = { ...commentsMap };
      const key = selectedArticle.title;
      updated[key] = updated[key] ? [newComment, ...updated[key]] : [newComment];
      setCommentsMap(updated);
      setComment('');
    }
  };

  const handleLike = (index) => {
    if (!loggedIn) return;
    const article = articles[index];
    const key = `${username}_${article.title}`;
    if (userLikes[key]) return;

    const updated = [...articles];
    updated[index].likes = (updated[index].likes || 0) + 1;
    setArticles(updated);

    const updatedLikes = { ...userLikes, [key]: true };
    setUserLikes(updatedLikes);
  };

  const handleEdit = (index) => {
    const article = articles[index];
    if (isAdmin || username === article.author) {
      setTitle(article.title);
      setContent(article.content);
      setTags((article.tags || []).join(', '));
      setEditIndex(index);
    }
  };

  const handleSendMessage = () => {
    if (!recipientUsername || !messageContent) {
      alert('Both recipient and message content are required!');
      return;
    }
    const newMessages = { ...messages };
    if (!newMessages[recipientUsername]) {
      newMessages[recipientUsername] = [];
    }
    newMessages[recipientUsername].push({
      from: username,
      to: recipientUsername,
      text: messageContent,
      timestamp: new Date().toLocaleString(),
      read: false
    });
    setMessages(newMessages);
    setRecipientUsername('');  // Clear recipient input
    setMessageContent('');  // Clear message input
  };

  const userMessages = messages[username] || [];

  const userArticles = articles.filter(article => article.author === username);
  const totalLikes = userArticles.reduce((sum, article) => sum + (article.likes || 0), 0);

  // 登录界面
  const renderLogin = () => (
  <div style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#4682b4', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem', boxSizing: 'border-box', overflowX: 'hidden' }}>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#4682b4' }}>
      <div style={{ backgroundColor: '#87ceeb', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '400px' }}>
        <Typography variant="h4" gutterBottom>Login</Typography>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          style={{ marginTop: '1rem' }}
        >
          Login
        </Button>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={handleRegister}
          style={{ marginTop: '1rem' }}
        >
          Register
        </Button>
      </div>
    </div>
  </div>
  );

  // 登录后显示的页面
  const renderMainPage = () => (
    <div style={{ minHeight: '100vh', width: '100vw', backgroundColor: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem', boxSizing: 'border-box', overflowX: 'hidden' }}>
      <div style={{ width: '100%', maxWidth: '1280px', backgroundColor: '#ffffff', color: '#1e293b', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '2rem', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h4">Article Upload Site</Typography>
          {loggedIn && (
            <>
              <Button onClick={() => setViewingProfile(true)}>User Center</Button>
              <Button onClick={() => setViewingMessages(true)}>Message</Button>
            </>
          )}
        </div>

        {viewingMessages ? (
          <div>
            <Typography variant="h5">{username} 's Message Center</Typography>
            <Button onClick={() => setViewingMessages(false)} variant="outlined">return</Button>
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
            {viewingProfile ? (
              <div>
                <Typography variant="h5">{username} 's User Center'</Typography>
                <Typography variant="body1">Number of Article：{userArticles.length}</Typography>
                <Typography variant="body1">Likes：{totalLikes}</Typography>
                {userArticles.map((article, index) => (
                  <Card key={index} style={{ margin: '1rem 0' }}>
                    <CardContent>
                      <Typography variant="h6">{article.title}</Typography>
                      <Typography variant="body2">{article.timestamp}</Typography>
                      <Typography variant="body2">Likes：{article.likes}</Typography>
                    </CardContent>
                  </Card>
                ))}
                <Button onClick={() => setViewingProfile(false)} variant="outlined">Return</Button>
              </div>
            ) : (
              <div>
                <Typography variant="h6" gutterBottom>
                  Logged in as: {username}
                </Typography>
                <Button onClick={handleLogout} variant="contained" color="secondary">Logout</Button>
                <div style={{ marginBottom: '1.5rem' }}>
                  <TextField label="Article Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth margin="normal" />
                  <TextField label="Write your article here (Markdown supported)" value={content} onChange={(e) => setContent(e.target.value)} multiline rows={6} fullWidth margin="normal" />
                  <TextField label="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} fullWidth margin="normal" />
                  <Button onClick={handleUpload} variant="contained" color="primary">{editIndex !== null ? 'Update Article' : 'Upload Article'}</Button>
                </div>

                <TextField label="Search articles..." value={search} onChange={(e) => setSearch(e.target.value)} fullWidth margin="normal" />

                <div style={{ marginTop: '2rem' }}>
                  {articles.filter(article => article.title.toLowerCase().includes(search.toLowerCase()) || article.content.toLowerCase().includes(search.toLowerCase())).map((article, index) => (
                    <Card key={index} style={{ marginBottom: '1.5rem' }}>
                      <CardContent>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6" style={{ cursor: 'pointer', color: '#1e88e5' }} onClick={() => { setSelectedArticle(article); setOpenDialog(true); }}>
                            {article.title}
                          </Typography>
                          <div>
                            <IconButton onClick={() => handleLike(index)}><ThumbUpIcon color="primary" /></IconButton>
                            {(isAdmin || username === article.author) && (
                              <IconButton onClick={() => handleEdit(index)}><EditIcon color="action" /></IconButton>
                            )}
                            {isAdmin && (
                              <IconButton onClick={() => handleDeleteArticle(index)}><DeleteIcon color="error" /></IconButton>
                            )}
                          </div>
                        </div>
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

  return loggedIn ? renderMainPage() : renderLogin();
}
