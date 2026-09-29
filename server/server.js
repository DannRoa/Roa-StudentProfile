require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

app.use(express.static(path.join(__dirname, '../www')));

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
        req.user = user;
        next();
    });
}


app.post('/api/login', (req, res) => {
    const { studentIdOrEmail, password } = req.body;

    if (!studentIdOrEmail || !password) {
        return res.status(400).json({ error: 'Student ID/Email and password are required.' });
    }

    db.get(
        `SELECT * FROM students WHERE student_id = ? OR email = ?`,
        [studentIdOrEmail, studentIdOrEmail],
        (err, student) => {
            if (err) return res.status(500).json({ error: 'Database server error.' });
            if (!student) return res.status(401).json({ error: 'Invalid student ID or password.' });

            const validPassword = bcrypt.compareSync(password, student.password);
            if (!validPassword) return res.status(401).json({ error: 'Invalid student ID or password.' });

            const token = jwt.sign(
                { id: student.id, student_id: student.student_id },
                JWT_SECRET,
                { expiresIn: '2h' }
            );

            res.json({
                message: 'Login successful',
                token: token,
                studentId: student.student_id
            });
        }
    );
});


app.get('/api/profile', authenticateToken, (req, res) => {
    db.get(
        `SELECT id, student_id, email, name, course, year_level, bio, skills, profile_picture FROM students WHERE id = ?`,
        [req.user.id],
        (err, student) => {
            if (err) return res.status(500).json({ error: 'Unable to retrieve profile. Please try again.' });
            if (!student) return res.status(404).json({ error: 'Student profile not found.' });
            res.json(student);
        }
    );
});


app.put('/api/profile', authenticateToken, (req, res) => {
    const { name, course, year_level, bio, skills, profile_picture } = req.body;

    db.run(
        `UPDATE students 
         SET name = COALESCE(?, name), 
             course = COALESCE(?, course), 
             year_level = COALESCE(?, year_level), 
             bio = COALESCE(?, bio), 
             skills = COALESCE(?, skills), 
             profile_picture = COALESCE(?, profile_picture)
         WHERE id = ?`,
        [name, course, year_level, bio, skills, profile_picture, req.user.id],
        function (err) {
            if (err) return res.status(500).json({ error: 'Unable to update your profile.' });
            res.json({ message: 'Profile updated successfully.' });
        }
    );
});

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));