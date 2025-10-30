import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';

export default function useFetch(url, options = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(url));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return undefined;

    let mounted = true;
    setLoading(true);
    apiClient
      .get(url, options)
      .then((response) => {
        if (mounted) setData(response.data);
      })
      .catch((err) => {
        if (mounted) setError(err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [url]);

  return { data, loading, error };
}
