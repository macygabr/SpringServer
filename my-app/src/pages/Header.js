import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import AdbIcon from '@mui/icons-material/Adb';
import Skeleton from '@mui/material/Skeleton';
import { useNavigate } from 'react-router-dom';

const pages = ['Products', 'Pricing', 'Blog'];

function Header({ auth, setAuth }) {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAuthStatus = async () => {
            try {
                const result = await axios.post('http://37.194.168.90:2000/myAccount', {}, { withCredentials: true });
                setUser(result.data);
                setAuth(true); 
            } catch (err) {
                console.error('Error fetching user data:', err);
                setAuth(false);
            } finally {
                setLoading(false); 
            }
        };
        fetchAuthStatus();
    }, [setAuth]);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleAccount = () => {
        navigate('/myAccount');
    };

    const handleProfile = () => {
        navigate('/profile');
    };

    const handleLogout = async () => {
        try {
            await axios.post('http://37.194.168.90:2000/logout', {}, { withCredentials: true });
            setAuth(false);
            setAnchorEl(null);
            setUser(null);
            navigate('/home');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    const handleSignInClick = () => {
        navigate('/signIn');
    };

    const handleSignUpClick = () => {
        navigate('/signUp');
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/home"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        LOGO
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        LOGO
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Skeleton variant="text" width={80} sx={{ marginRight: 2 }} />
                            <Skeleton variant="rectangular" width={120} height={40} />
                        </Box>
                    ) : (
                        <div>
                            {!auth ? (
                              <Box>
                                <Button color="inherit" onClick={handleSignInClick}>
                                    Sign In
                                </Button>
                                <Button color="inherit" onClick={handleSignUpClick}>
                                    Sign Up
                                </Button>
                              </Box>
                            ) : (
                              <IconButton
                                  size="large"
                                  aria-label="account of current user"
                                  aria-controls="menu-appbar"
                                  aria-haspopup="true"
                                  onClick={handleMenu}
                                  color="inherit"
                              >
                                  <Avatar alt={user?.firstName} src={user?.avatar} />
                              </IconButton>
                            )}
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                                <MenuItem onClick={handleAccount}>My account</MenuItem>
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </div>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Header;
