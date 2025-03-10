import Servicios from '../models/servicios.models.js';
import Planificaciones from '../models/planificaciones.models.js';
import { Op } from 'sequelize';

const getAll = async (idPlan, userId) => {
    try {

        // Nuevo agregado para validar que la planificacion pertenezca al usuario, NO FUE PROBADA EN EL TEST
        const planificacion = await Planificaciones.findOne({
            where: {
                ID: idPlan,
                ID_Usuario: userId
            }
        });

        if (!planificacion) {
            const error = new Error('Planificación no encontrada o no pertenece al usuario');
            error.status = 404;
            throw error;
        }
        // Fin del nuevo agregado

        const all = await Servicios.findAll({
            where: {
                ID_Planificacion: idPlan
            }
        });
        if (all.length === 0) {
            const error = new Error('No hay servicios');
            error.status = 404;
            throw error;
        }
        return all;
    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al obtener todos los servicios');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const getById = async (id, userId) => {
    try {
        const servicio = await Servicios.findByPk(id);
        if (!servicio) {
            const error = new Error('Servicio no encontrado');
            error.status = 404;
            throw error;
        }
        // Nuevo agregado para validar que la planificacion pertenezca al usuario, NO FUE PROBADA EN EL TEST
        const planificacion = await Planificaciones.findOne({
            where: {
                ID: servicio.ID_Planificacion,
                ID_Usuario: userId
            }
        });

        if (!planificacion) {
            const error = new Error('Planificación no encontrada o no pertenece al usuario');
            error.status = 404;
            throw error;
        }
        // Fin del nuevo agregado
        return servicio;
    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al obtener el servicio por ID');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const getByFilter = async (filter, idPlan, userId) => {
    try {
        // Nuevo agregado para validar que la planificacion pertenezca al usuario, NO FUE PROBADA EN EL TEST
        const planificacion = await Planificaciones.findOne({
            where: {
                ID: idPlan,
                ID_Usuario: userId
            }
        });

        if (!planificacion) {
            const error = new Error('Planificación no encontrada o no pertenece al usuario');
            error.status = 404;
            throw error;
        }
        // Fin del nuevo agregado

        const all = await Servicios.findAll({
            where: {
                Nombre: {
                    [Op.like]: `%${filter}%`
                },
                ID_Planificacion: idPlan
            }
        });

        if (all.length === 0) {
            const error = new Error('No hay servicios');
            error.status = 404;
            throw error;
        }

        return all;
    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al obtener servicios por filtro');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const crearServicio = async (body) => {
    try {
        if (!body.Nombre || !body.ID_Planificacion) {
            const error = new Error('Nombre e ID_Planificacion son obligatorios');
            error.status = 400;
            throw error;
        }

        const servicio = await Servicios.create({
            Nombre: body.Nombre,
            Descripcion: body.Descripcion,
            Precio: body.Precio,
            ID_Planificacion: body.ID_Planificacion
        });

        return servicio.dataValues;

    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al crear un servicio');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const actualizarServicio = async (id, body, userId) => {
    try {
        const serv = await Servicios.findByPk(id);
        if (!serv) {
            const error = new Error('Servicio no encontrado');
            error.status = 404;
            throw error;
        }
        // Nuevo agregado para validar que la planificacion pertenezca al usuario, NO FUE PROBADA EN EL TEST
        const planificacion = await Planificaciones.findOne({
            where: {
                ID: serv.ID_Planificacion,
                ID_Usuario: userId
            }
        });

        if (!planificacion) {
            const error = new Error('No pertenece al usuario');
            error.status = 404;
            throw error;
        }
        // Fin del nuevo agregado

        serv.Nombre = body.Nombre;
        serv.Descripcion = body.Descripcion;
        serv.Precio = body.Precio;

        await serv.save();
        return serv.dataValues;

    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al actualizar un servicio');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const eliminarServicio = async (id) => {
    try {
        const serv = await Servicios.findByPk(id);
        if (!serv) {
            const error = new Error('Servicio no encontrado');
            error.status = 404;
            throw error;
        }
        await serv.destroy();
        return { message: 'Servicio eliminado' };
    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al eliminar un servicio');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

export default {
    getAll,
    getById,
    getByFilter,
    crearServicio,
    actualizarServicio,
    eliminarServicio
};