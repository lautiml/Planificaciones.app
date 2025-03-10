import Planificaciones from '../models/planificaciones.models.js';
import { Op } from 'sequelize';

const getAll = async (userId) => {
    try {
        const all = await Planificaciones.findAll({
            where: {
                ID_Usuario: userId
            }
        });
        if (all.length === 0) {
            const error = new Error('No hay planificaciones');
            error.status = 404;
            throw error;
        }
        return all;
    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al obtener todas las planificaciones');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const getById = async (id, userId) => {
    try {
        const planificacion = await Planificaciones.findOne({
            where: {
                ID: id,
                ID_Usuario: userId
            }
        });
        if (!planificacion) {
            const error = new Error('Planificacion no encontrada');
            error.status = 404;
            throw error;
        }
        return planificacion;
    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al obtener la planificacion por ID');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const getByFilter = async (filter, userId) => {
    try {
        const all = await Planificaciones.findAll({
            where: {
                Nombre: {
                    [Op.like]: `%${filter}%`
                },
                ID_Usuario: userId
            }
        });

        if (all.length === 0) {
            const error = new Error('No hay planificaciones');
            error.status = 404;
            throw error;
        }

        return all;
    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al obtener planificaciones por filtro');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const crearPlanificacion = async (body, userId) => {
    try {
        if (!body.Nombre || !body.FechaInicio || !body.FechaFin) {
            const error = new Error('ID_Usuario, Nombre, FechaInicio y FechaFin son obligatorios');
            error.status = 400;
            throw error;
        }
        
        if (body.FechaInicio > body.FechaFin) {
            const error = new Error('FechaInicio debe ser menor a FechaFin');
            error.status = 400;
            throw error;
        }

        const plan = await Planificaciones.create({
            Nombre: body.Nombre,
            Descripcion: body.Descripcion,
            FechaInicio: body.FechaInicio,
            FechaFin: body.FechaFin,
            ID_Usuario: userId
        });

        return plan.dataValues;

    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al crear una planificacion');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const actualizarPlanificacion = async (id, body) => {
    try {
        const plan = await Planificaciones.findByPk(id);
        if (!plan) {
            const error = new Error('Planificacion no encontrada');
            error.status = 404;
            throw error;
        }
        plan.Nombre = body.Nombre;
        plan.Descripcion = body.Descripcion;
        plan.FechaInicio = body.FechaInicio;
        plan.FechaFin = body.FechaFin;

        await plan.save();
        return plan.dataValues;

    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al actualizar una planificacion');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const eliminarPlanificacion = async (id) => {
    try {
        const plan = await Planificaciones.findByPk(id);
        if (!plan) {
            const error = new Error('Planificacion no encontrada');
            error.status = 404;
            throw error;
        }

        await plan.destroy();
        return { message: 'Planificacion eliminada' };
    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al eliminar una planificacion');
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
    crearPlanificacion,
    actualizarPlanificacion,
    eliminarPlanificacion
};