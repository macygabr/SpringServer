import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Confirmation() {
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchAuthStatus = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const token = urlParams.get('token');

                if (!token) {
                    console.error('Token is missing');
                    return;
                }
                
                const response = await axios.get('http://37.194.168.90:2000/api/confirm', {
                    params: {
                        token: token
                    }
                });

                document.cookie = `macygabr=${response.data}; path=/; max-age=86400;`;
                navigate('/home');
            } catch (err) {
                console.log(err);
            }
        };
        fetchAuthStatus();
    }, [navigate]);

    return (
        <div>
            Hi
        </div>
    );
}

export default Confirmation;