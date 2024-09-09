import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import Header from './Header';

function Home() {
    const [auth, setAuth] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchAuthStatus = async () => {
            try {
                const result = await axios.post('http://37.194.168.90:2000/home', {}, { withCredentials: true });
                setAuth(true);
                setUsers(result.data);
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
                    <>
                        <List>
                            {[...Array(5)].map((_, index) => (
                                <ListItem key={index}>
                                    <Skeleton variant="text" width={200} />
                                    <Skeleton variant="text" width={150} sx={{ marginLeft: 2 }} />
                                </ListItem>
                            ))}
                        </List>
                    </>
                ) : auth ? (
                    <>
                        <Typography variant="h5">Users:</Typography>
                        <List>
                            {users.map(user => (
                                <ListItem key={user.id}>
                                    <ListItemText primary={user.firstName} secondary={user.email} />
                                </ListItem>
                            ))}
                        </List>
                    </>
                ) : (
                    <Typography variant="h6">Please sign in.</Typography>
                )}
            </Box>
        </Box>
    );
}

export default Home;
