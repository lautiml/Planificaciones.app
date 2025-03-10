import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Usuarios from '../models/usuarios.models.js';

dotenv.config();

// ---------------------- MIDDLEWARES ----------------------

async function logueado(req, res, next) {
    try {

        console.log("Cookies:", req.headers.cookie); // Muestra todas las cookies recibidas
        const cookieJWT = req.cookies['user']; // Accede a la cookie específica, ajusta 'user' según sea necesario 

        if (!cookieJWT) {
            return res.status(401).json('No se encontró la cookie');
        }

        const decodificada = jwt.verify(cookieJWT, process.env.JWT_SECRET);
        console.log("cookie decodificada", decodificada);

        const usuario = await Usuarios.findOne({
            where: {
                Id: decodificada.Id
            }

        });
        if (!usuario) {
            res.status(401).json('Usuario no encontrado');
        }

        req.userId = decodificada.Id;

        next();
    } catch (error) {
        console.error(error);
        res.status(401).json('Acceso no autorizado');
    }
}

export default { logueado };
