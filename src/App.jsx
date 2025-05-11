import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ArticleUploader() {
  const [articles, setArticles] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [search, setSearch] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('articles');
    if (stored) {
      setArticles(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('articles', JSON.stringify(articles));
  }, [articles]);

  const handleUpload = () => {
    if (!title.trim() || !content.trim()) return;
    const timestamp = new Date().toLocaleString();
    const newArticle = { title, content, timestamp };
    setArticles([newArticle, ...articles]);
    setTitle('');
    setContent('');
  };

  const handleDelete = (index) => {
    const updated = [...articles];
    updated.splice(index, 1);
    setArticles(updated);
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(search.toLowerCase()) ||
    article.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#0f172a',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        boxSizing: 'border-box',
        overflowX: 'hidden'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1080px',
          backgroundColor: '#ffffff',
          color: '#1e293b',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          padding: '2rem',
          boxSizing: 'border-box'
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Article Upload Site
        </Typography>

        <div style={{ marginBottom: '1.5rem' }}>
          <TextField
            label="Article Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Write your article here (Markdown supported)"
            value={content}
            onChange={e => setContent(e.target.value)}
            multiline
            rows={6}
            fullWidth
            margin="normal"
          />
          <Button onClick={handleUpload} variant="contained" color="primary">
            Upload Article
          </Button>
        </div>

        <TextField
          label="Search articles..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          fullWidth
          margin="normal"
        />

        <div style={{ marginTop: '2rem' }}>
          {filteredArticles.map((article, index) => (
            <Card key={index} style={{ marginBottom: '1.5rem' }}>
              <CardContent>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Typography
                    variant="h6"
                    style={{ cursor: 'pointer', color: '#1e88e5' }}
                    onClick={() => {
                      setSelectedArticle(article);
                      setOpenDialog(true);
                    }}
                  >
                    {article.title}
                  </Typography>
                  <IconButton onClick={() => handleDelete(index)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </div>
                <Typography variant="body2" color="textSecondary">
                  Uploaded at: {article.timestamp}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullScreen>
          <DialogTitle>{selectedArticle?.title}</DialogTitle>
          <DialogContent>
            <ReactMarkdown>{selectedArticle?.content}</ReactMarkdown>
            <Typography
              variant="caption"
              display="block"
              color="textSecondary"
              style={{ marginTop: '1rem' }}
            >
              Uploaded at: {selectedArticle?.timestamp}
            </Typography>
            <Button
              onClick={() => setOpenDialog(false)}
              variant="outlined"
              style={{ marginTop: '1rem' }}
            >
              Close
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
