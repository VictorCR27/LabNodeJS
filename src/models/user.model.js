import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email:{
            type:String,
            trim:true,
            required:true
        },
        password:{
            type:String,
            trim:true,
            required:true
        }
    },{timestamps:true}
)

// Asigna la colección 'usuarios' a este esquema
const UserModel = mongoose.model("Users", userSchema, "Users");

export default UserModel;

