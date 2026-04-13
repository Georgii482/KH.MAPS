const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const cors = require('cors');
const fs = require('fs');
const path = require('path');

app.use(cors());
app.use(express.json());

const dataFilePath = path.join(__dirname, 'users.json');

let users = [];
try {
    if (fs.existsSync(dataFilePath)) {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        users = JSON.parse(data);
        console.log(`Loaded ${users.length} users from storage`);
    } else {
        fs.writeFileSync(dataFilePath, JSON.stringify([]));
        console.log('Created new users storage file');
    }
} catch (error) {
    console.error('Error loading user data:', error);
}

function saveUsers() {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2));
        console.log('User data saved to file');
    } catch (error) {
        console.error('Error saving user data:', error);
    }
}

app.get("/users", (req, res) => {
    const safeUsers = users.map(user => ({
        name: user.name,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        choice: user.choice || ""
    }));
    res.json(safeUsers);
});

app.post("/users", async (req, res) => {
    try {
        const existingUser = users.find(user => user.name === req.body.name);
        if (existingUser) {
            return res.status(400).send("User already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = {
            name: req.body.name,
            password: hashedPassword,
            firstName: req.body.firstName || "",
            lastName: req.body.lastName || "",
            choice: req.body.choice || "",
            createdAt: new Date().toISOString()
        };

        users.push(user);
        console.log("New user registered:", user.name);

        const folderName = user.name;
        if (!fs.existsSync(folderName)) {
            const folderPath = path.join('C:', 'Users', 'Dika', 'Desktop', 'YP', 'static', 'uploads', folderName);
            fs.mkdirSync(folderPath, { recursive: true });
            console.log('Папку створено!');
        } else {
            console.log('Папка вже існує.');
        }

        saveUsers();

        res.status(201).send();
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).send("Server error during registration");
    }
});
app.post("/users/login", async(req, res) => {
    const user = users.find(user => user.name === req.body.name);
    if(!user) {
        return res.status(400).send("Cannot find user");
    }
    
    try {
        if(await bcrypt.compare(req.body.password, user.password)) {
            console.log("User logged in successfully:", user.name);
            
            user.lastLogin = new Date().toISOString();
            saveUsers();
            
            res.send("Success");
        } else {
            console.log("Failed login attempt for:", user.name);
            res.send("Not Allowed");
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send("Server error during login");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

process.on('SIGINT', () => {
    console.log('Server shutting down, saving user data...');
    saveUsers();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('Server shutting down, saving user data...');
    saveUsers();
    process.exit(0);
});