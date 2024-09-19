'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export function ConfirmForm(): React.JSX.Element {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const confirmToken = async () => {
      if (!token) {
        setError('Token is missing');
        setLoading(false);
        return;
      }

      try {
        const { error } = await authClient.signUpToken(token);
        if (error) {
          setError(error);
        } else {
          router.refresh(); 
        }
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    confirmToken();
  }, [token, router]);

  return (
    <div>
      <h1>Confirm your action</h1>
      {loading && <p>Loading...</p>}
      {error && (
        <Stack spacing={2}>
          <Alert severity="error">{error}</Alert>
          <Button onClick={() => router.push('/')} variant="contained">Go to Home</Button>
        </Stack>
      )}
    </div>
  );
}
