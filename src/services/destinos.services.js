import Destinos from "../models/destinos.models.js";
import Planificaciones from "../models/planificaciones.models.js";
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

        const all = await Destinos.findAll({
            where: {
                ID_Planificacion: idPlan
            }
        });
        if (all.length === 0) {
            const error = new Error('No hay destinos');
            error.status = 404;
            throw error;
        }
        return all;
    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al obtener todos los destinos');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const getById = async (id, userId) => {
    try {
        const destino = await Destinos.findByPk(id);
        if (!destino) {
            const error = new Error('Destino no encontrado');
            error.status = 404;
            throw error;
        }

        // Nuevo agregado para validar que la planificacion pertenezca al usuario, NO FUE PROBADA EN EL TEST
        const planificacion = await Planificaciones.findOne({
            where: {
                ID: destino.ID_Planificacion,
                ID_Usuario: userId
            }
        });

        if (!planificacion) {
            const error = new Error('Planificación no encontrada o no pertenece al usuario');
            error.status = 404;
            throw error;
        }
        // Fin del nuevo agregado

        return destino;
    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al obtener el destino por ID');
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

        const all = await Destinos.findAll({
            where: {
                Nombre: {
                    [Op.like]: `%${filter}%`
                },
                ID_Planificacion: idPlan
            }
        });

        if (all.length === 0) {
            const error = new Error('No hay destinos');
            error.status = 404;
            throw error;
        }

        return all;
    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al obtener destinos por filtro');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const crearDestino = async (destino) => {
    try {
        if (!destino.ID_Planificacion || !destino.Nombre) {
            const error = new Error('ID_Planificacion y Nombre son requeridos');
            error.status = 400;
            throw error;
        }

        const des = await Destinos.create({
            ID_Planificacion: destino.ID_Planificacion,
            Nombre: destino.Nombre,
            FechaInicio: destino.FechaInicio,
            FechaFin: destino.FechaFin,
        });

        return des.dataValues;

    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al crear un destino');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const actualizarDestino = async (id, destino, userId) => {
    try {
        const des = await Destinos.findByPk(id);
        if (!des) {
            const error = new Error('Destino no encontrado');
            error.status = 404;
            throw error;
        }

        // Nuevo agregado para validar que la planificacion pertenezca al usuario, NO FUE PROBADA EN EL TEST
        const planificacion = await Planificaciones.findOne({
            where: {
                ID: des.ID_Planificacion,
                ID_Usuario: userId
            }
        });

        if (!planificacion) {
            const error = new Error('No pertenece al usuario');
            error.status = 404;
            throw error;
        }
        // Fin del nuevo agregado

        des.Nombre = destino.Nombre;
        des.FechaInicio = destino.FechaInicio;
        des.FechaFin = destino.FechaFin;

        await des.save();
        return des.dataValues;

    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al actualizar un destino');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const eliminarDestino = async (id) => {
    try {
        const des = await Destinos.findByPk(id);
        if (!des) {
            const error = new Error('Destino no encontrado');
            error.status = 404;
            throw error;
        }

        await des.destroy();
        return { message: 'Destino eliminado' };
    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al eliminar un destino');
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
    crearDestino,
    actualizarDestino,
    eliminarDestino
};