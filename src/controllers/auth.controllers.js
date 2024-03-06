import UserModel from "../models/user.model.js";
import UserAccountVerificationLogModel from "../models/userAccountVerificationLog.js";
import { sendVerificationEmail } from "../models/emailService.js";

export const register = async (req, res) => {
    const { email, password } = req.body;
    try {

        const newUser = new UserModel({ email, password });


        const userSaved = await newUser.save();


        const verificationLog = new UserAccountVerificationLogModel({
            user: userSaved._id,
            emailSentAt: new Date()
        });

        await verificationLog.save();


        await sendVerificationEmail(email, userSaved._id);


        res.json({
            id: userSaved._id,
            email: userSaved.email,
            createdAt: userSaved.createdAt,
            updatedAt: userSaved.updatedAt
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const verifyAccount = async (req, res) => {
    const userId = req.query.id;

    try {

        const user = await UserModel.findById(userId);

        if (!user) {

            return res.status(404).json({ message: "Usuario no encontrado" });
        }


        user.verified = true;
        await user.save();


        const verificationLog = await UserAccountVerificationLogModel.findOneAndUpdate(
            { user: userId },
            { $set: { clickedAt: new Date() } },
            { new: true }
        );


        res.send('Tu cuenta ha sido verificada correctamente.');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};



