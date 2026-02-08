import express from 'express';
import bcrypt from 'bcryptjs';
import { jwt } from 'jsonwebtoken';
import { pool } from '../db.js';
import { use } from 'react';
import { protect } from '../middlewares/auth.js';

const router = express.Router();
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30*24 * 60 * 60 * 1000 // 30 day
};

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
}

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }
 
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, hashedPassword]
        ); 
       
        const token = generateToken(newUser.rows[0].id);
        res.cookie('token', token, cookieOptions);
        return res.status(201).json({user: newUser.rows[0]});

});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const userData = user.rows[0];
    const validPassword = await bcrypt.compare(password, userData.password);
    if (!validPassword) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(userData.id);
    res.cookie('token', token, cookieOptions);
    return res.status(200).json({ user: { id: userData.id, username: userData.username, email: userData.email } });
});


router.post('/logout', (req, res) => {
    res.clearCookie('token', cookieOptions);
    return res.status(200).json({ message: 'Logged out successfully' });
});

router.get('/me',protect, async (req, res) => {
   res.json({ user: req.user });
   
});

export default router;