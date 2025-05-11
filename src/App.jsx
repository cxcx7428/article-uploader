import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ArticleUploader() {
  const [articles, setArticles] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [search, setSearch] = useState('');

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

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(search.toLowerCase()) ||
    article.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}>Article Upload Site</h1>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Article Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
        />
        <textarea
          placeholder="Write your article here (Markdown supported)..."
          rows={6}
          value={content}
          onChange={e => setContent(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
        />
        <button onClick={handleUpload} style={{ padding: '0.5rem 1rem' }}>Upload Article</button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>

      <div>
        {filteredArticles.map((article, index) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '0.5rem' }}>{article.title}</h2>
            <ReactMarkdown style={{ whiteSpace: 'pre-wrap', marginBottom: '0.5rem' }}>
              {article.content}
            </ReactMarkdown>
            <div style={{ fontSize: '12px', color: 'gray' }}>Uploaded at: {article.timestamp}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
