import UserModel from "../models/user.model.js";
import UserAccountVerificationLogModel from "../models/userAccountVerificationLog.js";
import { sendVerificationEmail } from "../models/emailService.js";

export const register = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Crear un nuevo usuario
        const newUser = new UserModel({ email, password });

        // Guardar el nuevo usuario en la base de datos
        const userSaved = await newUser.save();

        // Crear un registro en el log de verificación de cuenta
        const verificationLog = new UserAccountVerificationLogModel({
            user: userSaved._id,
            emailSentAt: new Date() // Fecha en la que se envió el correo de verificación
        });

        await verificationLog.save();

        // Enviar correo electrónico de verificación
        await sendVerificationEmail(email, userSaved._id);

        // Devolver la respuesta al cliente
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
    const userId = req.query.id; // Obtiene el ID del usuario de la consulta

    try {
        // Encuentra el usuario en la base de datos
        const user = await UserModel.findById(userId);

        if (!user) {
            // Si no se encuentra el usuario, devuelve un error
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Actualiza el estado de verificación del usuario
        user.verified = true; // Suponiendo que tienes un campo "verified" en tu modelo de usuario
        await user.save();

        // Registra el clic en el enlace de verificación en el registro de verificación
        const verificationLog = await UserAccountVerificationLogModel.findOneAndUpdate(
            { user: userId },
            { $set: { clickedAt: new Date() } },
            { new: true }
        );

        // Devuelve una respuesta al cliente
        res.send('Tu cuenta ha sido verificada correctamente.');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};



