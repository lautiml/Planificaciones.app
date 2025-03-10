import Usuarios from '../models/usuarios.models.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

async function login (req, res) {
        const usuario = await Usuarios.findOne({
            where: {
                Email: req.body.Email,
                Password: req.body.Password
            }
        });
        if (!usuario) {
            return res.status(400).send({status: "Error", message: "Error durante login"});
        }

        const token = jwt.sign({
            Id: usuario.Id,
            Nombre: usuario.Nombre,
            Email: usuario.Email
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION
        });

        const cookieOption = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            path: '/'
        }

        console.log("ANTES DE RETORNAR LA COOKIE", token)
    
        //return token;
        res.cookie("user", token, cookieOption);
        res.status(200).json({ status: "Éxito", message: "Inicio de sesión exitoso", token });
};

export default login;