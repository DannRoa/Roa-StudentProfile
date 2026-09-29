const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT NOT NULL,
            course TEXT NOT NULL,
            year_level TEXT NOT NULL,
            bio TEXT,
            skills TEXT,
            profile_picture TEXT
        )
    `);

    db.get("SELECT COUNT(*) AS count FROM students", [], (err, row) => {
        if (row.count === 0) {
            const hashedPassword = bcrypt.hashSync("password123", 10);
            db.run(`
                INSERT INTO students (student_id, email, password, name, course, year_level, bio, skills)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                "20190016950",
                "20190016950@my.xu.edu.ph",
                hashedPassword,
                "Dann Ryven Carl Roa",
                "BS Information Technology",
                "3rd Year",
                "I am currently an Information Technology student engaging in desktop GUI interfaces and backend integration.",
                "Python Development, Java GUI (Swing), SQL & Database Management, Web Development"
            ]);
            console.log("Database seeded with default student (ID: 20190016950 / Pass: password123)");
        }
    });
});

module.exports = db;