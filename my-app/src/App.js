import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import MyAccount from './pages/MyAccount';
import Profile from './pages/Profile';
import Confirmation from './pages/Confirmation';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/signIn" element={<SignIn />} />
                <Route path="/signUp" element={<SignUp />} />
                <Route path="/myAccount" element={<MyAccount />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/api/confirm" element={<Confirmation />} />
            </Routes>
        </Router>
    );
}

export default App;