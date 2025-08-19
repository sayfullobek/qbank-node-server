const CryptoJS = require("crypto-js");
const { Users } = require("../models");

exports.createADMIN = async () => {
    const name = process.env.ADMIN_NAME;
    const username = process.env.ADMIN_USERNAME;
    const phoneNumber = process.env.ADMIN_PHONE_NUMBER;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const country = process.env.ADMIN_COUNTRY;

    try {
        const existingUser = await Users.findOne({ phoneNumber, role: 'admin' });
        if (existingUser) {
            console.log("Admin allaqachon mavjud.");
            return true;
        }

        const encryptedPassword = CryptoJS.AES.encrypt(
            password,
            process.env.PASSWORD_SECRET_KEY
        ).toString();

        const admin = new Users({
            name,
            username,
            phoneNumber,
            email,
            password: encryptedPassword,
            country,
            role: "admin",
            testExpireAt: "9999-08-18T23:06:56.661+00:00",
        });

        await admin.save();
        console.log("Admin muvaffaqiyatli yaratildi.");
        return true;
    } catch (err) {
        console.error("Admin yaratishda xatolik:", err.message);
        return false;
    }
};
