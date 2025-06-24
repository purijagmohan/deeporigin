import { useState } from 'react';
import axios from 'axios';
import styles from '../styles/Home.module.css';

interface TinyUrl {
  _id: string;
  shortId: string;
  longUrl: string;
}

export default function Home() {
  const [longUrl, setLongUrl] = useState('');
  const [generatedTinyUrl, setGeneratedTinyUrl] = useState<TinyUrl | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setCopySuccess('');

    if (!longUrl) {
      setErrorMessage('Please provide a long URL');
      return;
    }

    if (!isValidUrl(longUrl)) {
      setErrorMessage('Please enter a valid URL starting with http:// or https://');
      return;
    }

    try {
      const response = await axios.post('/tinyurls', { longUrl });
      setGeneratedTinyUrl(response.data);
    } catch (error) {
      console.error('Error creating tinyurl', error);
      setErrorMessage('Failed to create tiny URL. Please try again.');
    }
  };

  const handleCopy = () => {
    if (generatedTinyUrl) {
      navigator.clipboard.writeText(`${window.location.origin}/${generatedTinyUrl.shortId}`);
      setCopySuccess('Copied!');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>URL Shortener</h1>

        <form onSubmit={handleCreate} className={styles.form}>
          <input
            type="text"
            placeholder="Enter the URL to shorten"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            className={styles.input}
            disabled={!!generatedTinyUrl}
          />
          <button type="submit" className={styles.shortenButton} disabled={!!generatedTinyUrl}>
            Shorten
          </button>
        </form>

        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        {generatedTinyUrl && (
          <div className={styles.successSection}>
            <p className={styles.successMessage}>Success! Here's your short URL:</p>
            <div className={styles.shortUrlRow}>
              <a
                href={generatedTinyUrl.longUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.shortUrl}
              >
                {window.location.origin}/{generatedTinyUrl.shortId}
              </a>
              <button onClick={handleCopy} className={styles.copyButton}>Copy</button>
              {copySuccess && <span className={styles.copySuccess}>{copySuccess}</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
