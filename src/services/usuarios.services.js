import Usuarios from "../models/usuarios.models.js";

const getAll = async () => {
    try {
        const all = await Usuarios.findAll();
        if (all.length === 0) {
            const error = new Error('No hay usuarios');
            error.status = 404;
            throw error;
        }
        return all;
    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al obtener todos los usuarios');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const getById = async (id) => {
    try {
        const usuario = await Usuarios.findByPk(id);
        if (!usuario) {
            const error = new Error('Usuario no encontrado');
            error.status = 404;
            throw error;
        }
        return usuario;
    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al obtener el usuario por ID');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const crearUsuario = async (body) => {
    try {
        if (!body.Nombre || !body.Email || !body.Password) {
            const error = new Error('Nombre, Email y Password son obligatorios');
            error.status = 400;
            throw error;
        }

        const usuarioExistente = await Usuarios.findOne({
            where: {
                Email: body.Email
            }
        });

        if (usuarioExistente) {
            const error = new Error('El usuario ya existe');
            error.status = 409;
            throw error;
        }

        const usuario = await Usuarios.create({
            Nombre: body.Nombre,
            Email: body.Email,
            Password: body.Password,
        });

        return usuario.dataValues;
    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al crear un usuario');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const actualizarUsuario = async (id, body) => {
    try {
        const usuario = await Usuarios.findByPk(id);
        if (!usuario) {
            const app = new Error('Usuario no encontrado');
            app.status = 404;
            throw app;
        }

        usuario.Nombre = body.Nombre;
        usuario.Email = body.Email;
        usuario.Password = body.Password;

        await usuario.save();
        return usuario.dataValues;
    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al actualizar un usuario');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const eliminarUsuario = async (id) => {
    try {
        const usuario = await Usuarios.findByPk(id);
        if (!usuario) {
            const error = new Error('Usuario no encontrado');
            error.status = 404;
            throw error;
        }

        await usuario.destroy();
        return { message: 'Usuario eliminado' };
    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al eliminar un usuario');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};


export default {
    getAll,
    getById,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};