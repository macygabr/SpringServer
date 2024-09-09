import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Header from './Header';

function MyAccount() {
    const [auth, setAuth] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAuthStatus = async () => {
            try {
                const result = await axios.post('http://37.194.168.90:2000/myAccount', {}, { withCredentials: true });
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

    const handleDeleteAccount = async () => {
        try {
            await axios.delete('http://37.194.168.90:2000/deleteAccount', { withCredentials: true });
            setAuth(false);
            navigate('/home');
        } catch (error) {
            alert('Error deleting account:', error);
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Header auth={auth} setAuth={setAuth} />

            <Box sx={{ margin: 2 }}>
                {loading ? (
                    <Stack spacing={1}>
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="rectangular" width={210} height={60} />
                        <Skeleton variant="rounded" width={210} height={60} />
                    </Stack>
                ) : (
                    auth && (
                        <>
                            <Typography variant="h5">User:</Typography>
                            <List>
                                <ListItemText primary={user.firstName} secondary={user.lastName} />
                            </List>
                            <Button variant="contained" color="error" onClick={handleDeleteAccount}>
                                Delete Account
                            </Button>
                        </>
                    )
                )}
            </Box>
        </Box>
    );
}

export default MyAccount;
