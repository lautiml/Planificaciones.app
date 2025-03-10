import Hospedajes from "../models/hospedajes.models.js";
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

        const all = await Hospedajes.findAll({
            where: {
                ID_planificacion: idPlan
            }
        });
        if (all.length === 0) {
            const error = new Error('No hay hospedajes');
            error.status = 404;
            throw error;
        }
        return all;
    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al obtener todos los hospedajes');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const getById = async (id, userId) => {
    try {
        const hospedaje = await Hospedajes.findByPk(id);
        if (!hospedaje) {
            const error = new Error('hospedaje no encontrado');
            error.status = 404;
            throw error;
        }
        // Nuevo agregado para validar que la planificacion pertenezca al usuario, NO FUE PROBADA EN EL TEST
        const planificacion = await Planificaciones.findOne({
            where: {
                ID: hospedaje.ID_Planificacion,
                ID_Usuario: userId
            }
        });

        if (!planificacion) {
            const error = new Error('Planificación no encontrada o no pertenece al usuario');
            error.status = 404;
            throw error;
        }
        // Fin del nuevo agregado
        return hospedaje;
    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al obtener el hospedaje por ID');
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

        const all = await Hospedajes.findAll({
            where: {
                Nombre: {
                    [Op.like]: `%${filter}%`
                },
                ID_Planificacion: idPlan
            }
        });

        if (all.length === 0) {
            const error = new Error('No hay hospedajes');
            error.status = 404;
            throw error;
        }

        return all;
    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al obtener hospedajes por filtro');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const crearHospedaje = async (hospedaje) => {
    try {
        if (!hospedaje.ID_Planificacion || !hospedaje.Nombre) {
            const error = new Error('ID_Planificacion y Nombre son obligatorios');
            error.status = 400;
            throw error;
        }

        const hos = await Hospedajes.create({
            ID_Planificacion: hospedaje.ID_Planificacion,
            Nombre: hospedaje.Nombre,
            Descripcion: hospedaje.Descripcion,
            Tipo: hospedaje.Tipo,
            Precio: hospedaje.Precio,
            FechaInicio: hospedaje.FechaInicio,
            FechaFin: hospedaje.FechaFin,

        });

        return hos.dataValues;

    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al crear un hospedaje');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const actualizarHospedaje = async (id, hospedaje, userId) => {
    try {
        const hos = await Hospedajes.findByPk(id);
        if (!hos) {
            const error = new Error('Hospedaje no encontrado');
            error.status = 404;
            throw error;
        }
        // Nuevo agregado para validar que la planificacion pertenezca al usuario, NO FUE PROBADA EN EL TEST
        const planificacion = await Planificaciones.findOne({
            where: {
                ID: hos.ID_Planificacion,
                ID_Usuario: userId
            }
        });

        if (!planificacion) {
            const error = new Error('No pertenece al usuario');
            error.status = 404;
            throw error;
        }
        // Fin del nuevo agregado

        hos.Nombre = hospedaje.Nombre;
        hos.Descripcion = hospedaje.Descripcion;
        hos.Tipo = hospedaje.Tipo;
        hos.Precio = hospedaje.Precio;
        hos.FechaInicio = hospedaje.FechaInicio;
        hos.FechaFin = hospedaje.FechaFin;

        await hos.save();
        return hos.dataValues;

    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al actualizar un hospedaje');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const eliminarHospedaje = async (id) => {
    try {
        const hos = await Hospedajes.findByPk(id);
        if (!hos) {
            const error = new Error('Hospedaje no encontrado');
            error.status = 404;
            throw error;
        }

        await hos.destroy();
        return { message: 'Hospedaje eliminado' };
    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al eliminar un hospedaje');
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
    crearHospedaje,
    actualizarHospedaje,
    eliminarHospedaje
};