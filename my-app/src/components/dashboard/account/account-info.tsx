'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth/client';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  jobTitle: string;
  country: string;
  city: string;
  timezone: string;
};

export function AccountInfo(): React.JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await authClient.getUser();

      if (error) {
        setError(error);
        setLoading(false);
        return;
      }

      if (data) {
        setUser(data as User);
      } else {
        setUser(null);
      }

      setLoading(false);
    }

    fetchUser();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      return;
    }

    const result = await authClient.uploadAvatar(selectedFile);
    if (result.error) {
      setUploadError(result.error);
    } else {
      setUploadError(null);
      const { data, error } = await authClient.getUser();
      if (data) {
        setUser(data as User);
      }
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  if (!user) {
    return <Typography>No user data found</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar src={user.avatar} sx={{ height: '80px', width: '80px' }} />
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{user.firstName}</Typography>
            <Typography color="text.secondary" variant="body2">
              {user.city} {user.country}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {user.timezone}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="file-input"
        />
        <label htmlFor="file-input">
          <Button fullWidth variant="text" component="span">
            Select picture
          </Button>
        </label>
        <Button fullWidth variant="text" onClick={handleFileUpload}>
          Upload picture
        </Button>
        {uploadError && (
          <Typography color="error" variant="body2">
            {uploadError}
          </Typography>
        )}
      </CardActions>
    </Card>
  );
}
