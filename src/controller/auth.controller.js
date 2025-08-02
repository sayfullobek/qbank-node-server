const { Users } = require("../models");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// POST /auth/register
exports.register = async (req, res) => {
    try {
        const { name, username, phoneNumber, email, country, password, plan } = req.body;

        const existing = await Users.findOne({
            $or: [
                { username },
                { email },
                { phoneNumber }
            ]
        });
        if (existing) {
            return res.status(400).json({ message: "Bu foydalanuvchi allaqachon mavjud." });
        }

        const hashedPassword = CryptoJS.AES.encrypt(password, process.env.PASSWORD_SECRET_KEY).toString();

        const newUser = new Users({
            name,
            username,
            phoneNumber,
            email,
            country,
            password: hashedPassword,
            plan,
            role: "user"
        });

        await newUser.save();
        res.status(201).json({ message: "Foydalanuvchi ro'yxatdan o'tdi." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /auth/login
exports.login = async (req, res) => {
    try {
        const { login, password } = req.body; // username or email
        const user = await Users.findOne({
            $or: [
                { username: login },
                { email: login }
            ]
        });

        if (!user) return res.status(401).json({ message: "Foydalanuvchi topilmadi." });

        const decryptedPass = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECRET_KEY).toString(CryptoJS.enc.Utf8);
        if (decryptedPass !== password) return res.status(401).json({ message: "Parol noto'g'ri." });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });

        user.password = undefined;
        res.status(200).json({
            message: "Muvaffaqiyatli tizimga kirildi.",
            token,
            user
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /auth/me
exports.getMe = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await Users.findById(userId).select("-password");
        if (!user) return res.status(404).json({ message: "Foydalanuvchi topilmadi." });
        res.status(200).json(user);
    } catch (err) {

        res.status(500).json({ message: err.message });
    }
};
