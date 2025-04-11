import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { urls } from '../services/api';

const Interstitial: React.FC = () => {
  const { shortUrl } = useParams<{ shortUrl: string }>();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const [destinationUrl, setDestinationUrl] = useState('');

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const response = await urls.redirect(shortUrl!);
        setDestinationUrl(response.data.originalUrl);
      } catch (error) {
        navigate('/404');
      }
    };

    fetchUrl();
  }, [shortUrl, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      window.location.href = destinationUrl;
    }
  }, [countdown, destinationUrl]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          You will be redirected in {countdown} seconds
        </h1>

        {/* Ad Space */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6 min-h-[250px] flex items-center justify-center">
          <p className="text-gray-500">Advertisement Space</p>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Please wait while we redirect you to your destination.
          </p>
          <button
            onClick={() => window.location.href = destinationUrl}
            className="btn btn-primary"
          >
            Skip Ad
          </button>
        </div>
      </div>
    </div>
  );
};

export default Interstitial; 