const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose').default;
const secretKey = 'duck';
const path = require("path");


app.use(express.static(path.join(__dirname, 'public'), { "extensions": ["html", "htm", "js"] }));
app.use(bodyParser.json());

const { authenticateToken, authorizeRole } = require('../Middleware/authMiddleware');




mongoose.connect('mongodb://127.0.0.1:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    role:     { type: String}
    // Add other fields as needed
});

const User = mongoose.model('User', userSchema);


app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        console.log(username,password, role);
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the user to the database
        const user = await User.create({ username, password: hashedPassword, role });
        console.log('User registered:', user.username);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Retrieve the user from the database
        const user = await User.findOne({ username });

        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Generate a JWT token
        const token = jwt.sign({ username: user.username, role: user.role }, 'duck');
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});


app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/register.html');
});

app.get('/protected', authenticateToken, (req, res) => {
    // Only authenticated users can access this route
    res.json({ message: 'Protected route accessed successfully' });
});

app.get('/admin', authenticateToken, authorizeRole('admin'), (req, res) => {
    // Only users with the 'admin' role can access this route
    res.json({ message: 'Admin route accessed successfully' });
});


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});