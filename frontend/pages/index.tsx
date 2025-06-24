import { useState } from 'react';
import axios from 'axios';

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
    <div className="container">
      <div className="formCard">
        <h1 className="title">URL Shortener</h1>

        <form onSubmit={handleCreate} className="form">
          <input
            type="text"
            placeholder="Enter the URL to shorten"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            className="input"
            disabled={!!generatedTinyUrl}
          />
          <button type="submit" className="shortenButton" disabled={!!generatedTinyUrl}>
            Shorten
          </button>
        </form>

        {errorMessage && <p className="error">{errorMessage}</p>}

        {generatedTinyUrl && (
          <div className="successSection">
            <p className="successMessage">Success! Here's your short URL:</p>
            <div className="shortUrlRow">
              <a
                href={generatedTinyUrl.longUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shortUrl"
              >
                {window.location.origin}/{generatedTinyUrl.shortId}
              </a>
              <button onClick={handleCopy} className="copyButton">Copy</button>
              {copySuccess && <span className="copySuccess">{copySuccess}</span>}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .container {
          padding: 2rem;
          max-width: 500px;
          margin: auto;
          font-family: Arial, sans-serif;
        }

        .formCard {
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 2rem;
          background-color: #f9f9f9;
        }

        .title {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .input {
          padding: 0.75rem;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .shortenButton {
          padding: 0.75rem;
          font-size: 1rem;
          background-color: #6c63ff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .shortenButton:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .shortenButton:hover:not(:disabled) {
          background-color: #4b44d6;
        }

        .error {
          color: red;
          margin-top: 1rem;
        }

        .successSection {
          margin-top: 2rem;
        }

        .successMessage {
          color: green;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .shortUrlRow {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .shortUrl {
          color: #6c63ff;
          text-decoration: underline;
          word-break: break-all;
        }

        .copyButton {
          padding: 0.5rem 1rem;
          background-color: #e0e0e0;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .copyButton:hover {
          background-color: #c7c7c7;
        }

        .copySuccess {
          color: green;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
