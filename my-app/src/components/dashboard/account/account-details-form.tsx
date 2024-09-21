'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth/client';
import { User } from '@/types/user';
import { useRouter } from 'next/navigation'; 
import { paths } from '@/paths';

export function AccountDetailsForm(): React.JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<User>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    avatar: '',
    jobTitle: '',
    country: '',
    city: '',
    timezone: '',
    status: ''
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); 

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await authClient.getUser();
      
      if (error) {
        setLoading(false);
        router.push(paths.errors.notFound);
        return;
      }
  
      if (data && typeof data === 'object') {
        const userData: User = {
          id: data.id,
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          avatar: data.avatar || '',
          jobTitle: data.jobTitle || '',
          country: data.country || '',
          city: data.city || '',
          timezone: data.timezone || '',
          status: data.status || ''
        };

        setUser(userData);
        setFormData(userData);
      } else {
        setUser(null);
        router.push(paths.errors.notFound);
      }
  
      setLoading(false);
    }
  
    fetchUser();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    // try {
    //   // Assuming there's an updateUser method in authClient for updating user data
    //   const { error } = await authClient.updateUser(formData);
    //   if (error) {
    //     setError('Failed to update user details');
    //   } else {
    //     // Handle successful update (e.g., show a success message or redirect)
    //     router.push(paths.dashboard.overview);
    //   }
    // } catch (err) {
    //   setError('An unexpected error occurred');
    // }
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
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={5} xs={ 0}>
              <FormControl fullWidth required>
                <InputLabel>Имя</InputLabel>
                <OutlinedInput name="firstName" label="Имя" value={formData.firstName} onChange={handleChange} />
              </FormControl>
            </Grid>
            <Grid md={5} xs={ 0}>
              <FormControl fullWidth required>
                <InputLabel>Фамилия</InputLabel>
                <OutlinedInput name="lastName" label="Фамилия" value={formData.lastName} onChange={handleChange} />
              </FormControl>
            </Grid>
            <Grid md={5} xs={10}>
              <FormControl fullWidth required>
                <InputLabel>Почта</InputLabel>
                <OutlinedInput name="email" label="Почта" value={formData.email} onChange={handleChange} />
              </FormControl>
            </Grid>
            <Grid md={5} xs={10}>
              <FormControl fullWidth>
                <InputLabel>Город</InputLabel>
                <OutlinedInput name="city" value={formData.city} onChange={handleChange} />
              </FormControl>
            </Grid>
            <Grid md={5} xs={10}>
              <FormControl fullWidth>
                <InputLabel>Страна</InputLabel>
                <OutlinedInput name="country" value={formData.country} onChange={handleChange} />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button variant="contained" type="submit" sx={{ backgroundColor: '#1b3a69', '&:hover': { backgroundColor: '#0f1e3c' } }}>Сохранить</Button>
        </CardActions>
      </Card>
    </form>
  );
}
