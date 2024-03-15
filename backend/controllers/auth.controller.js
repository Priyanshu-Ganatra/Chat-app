import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import generateTokenAndSetCookie from '../utils/generateToken.js';

export const signup = async (req, res) => {
    try {
        const { fullname, username, password, confirmPassword, gender } = req.body;

        if (!fullname || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        const existingUser = await User.findOne({ username })
        if (existingUser) return res.status(400).json({ message: "Username already exists" });

        // hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

        const newUser = new User({
            fullname,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic
        })

        if (newUser) {
            // Generate JWT token
            generateTokenAndSetCookie(newUser._id, res);
            const savedUser = await newUser.save()
            res.status(201).json({ message: "User created successfully", savedUser })
        }
        else {
            res.status(500).json({ message: "Failed to create user" })
        }
    } catch (error) {
        console.log("Error in signup controller: ", error.message);
        res.status(500).json({ message: error.message })
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        const user = await User.findOne({ username });
        const isPasswordCorrect = user && (await bcryptjs.compare(password, user.password));

        if (isPasswordCorrect) {
            // Generate JWT token
            generateTokenAndSetCookie(user._id, res);
            res.status(200).json({ message: "Login successful", user })
        }
        else {
            res.status(400).json({ message: "Invalid credentials" })
        }

    } catch (error) {
        console.log("Error in login controller: ", error.message);
        res.status(500).json({ message: error.message })
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0}); 
        res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        console.log("Error in logout controller: ", error.message);
        res.status(500).json({ message: error.message })
    }
}