import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Header from './Header';

function Profile() {
    const [auth, setAuth] = useState(false);
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAuthStatus = async () => {
            try {
                const result = await axios.post('http://37.194.168.90:2000/profile', {}, { withCredentials: true });
                setAuth(true);
                setUser(result.data);
            } catch (err) {
                setAuth(false);
            } finally {
                setLoading(false);
            }
        };
        fetchAuthStatus();
    }, []);
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Header auth={auth} setAuth={setAuth} />
            <Box sx={{ margin: 2 }}>
            {loading ? (
                    <Stack spacing={1}>
                        <Skeleton variant="circular" width={120} height={120} />
                        <Skeleton variant="rectangular" width={210} height={60} />
                        <Skeleton variant="rounded" width={210} height={60} />
                    </Stack>
                ) : (
                    auth && (
                        <>
                            <Avatar
                            src={user.avatar}
                            alt={`${user.firstName} ${user.lastName}`}
                            sx={{ width: 120, height: 120, marginBottom: 2 }}
                        />
                        <Typography variant="h4">{user.firstName} {user.lastName}</Typography>
                        <Typography variant="subtitle1" color="textSecondary">{user.email}</Typography>
                        </>
                    )
                )}
            </Box>
        </Box>
    );
}

export default Profile;
