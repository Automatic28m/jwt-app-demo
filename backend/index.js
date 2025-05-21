import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { register, getUserFromEmail } from './config/database.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('✅ API is running');
});

app.post("/register", async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        if (!(fullname && email && password)) {
            return res.status(400).json({ message: "All input is required" });
        }

        const existed_user = await getUserFromEmail(email);
        if (existed_user.length > 0) {
            return res.status(409).json({ message: "User already exists. Please login." });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        // Use updated register() function
        const registrationResult = await register(fullname, email, encryptedPassword);

        if (registrationResult.status !== 201) {
            return res.status(500).json({ message: registrationResult.message });
        }

        // Create JWT token
        const token = jwt.sign(
            { user_id: registrationResult.userId, email },
            process.env.TOKEN_KEY,
            { expiresIn: "2h" }
        );

        return res.status(201).json({
            message: registrationResult.message,
            userId: registrationResult.userId,
            token
        });

    } catch (error) {
        console.error("❌ Registration error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
});


app.post("/login", (req, res) => {

})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});