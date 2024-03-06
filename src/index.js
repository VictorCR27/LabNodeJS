import app from "./app.js";
import { connectDB } from "./db.js";

connectDB();
app.listen(3000);
console.log('Estoy escuchando en el 3000')