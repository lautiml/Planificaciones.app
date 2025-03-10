import Actividades from "../models/actividades.models.js";
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

        const all = await Actividades.findAll({
            where: {
                ID_Planificacion: idPlan
            }
        });

        if (all.length === 0) {
            const error = new Error('No hay actividades');
            error.status = 404;
            throw error;
        }
        return all;
    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al obtener todas las actividades');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const getById = async (id, userId) => {
    try {
        const actividad = await Actividades.findByPk(id);
        if (!actividad) {
            const error = new Error('Actividad no encontrada');
            error.status = 404;
            throw error;
        }
        // Nuevo agregado para validar que la planificacion pertenezca al usuario, NO FUE PROBADA EN EL TEST
        const planificacion = await Planificaciones.findOne({
            where: {
                ID: actividad.ID_Planificacion,
                ID_Usuario: userId
            }
        });

        if (!planificacion) {
            const error = new Error('Planificación no encontrada o no pertenece al usuario');
            error.status = 404;
            throw error;
        }
        // Fin del nuevo agregado

        return actividad;
    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al obtener la actividad por ID');
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

        const all = await Actividades.findAll({
            where: {
                Nombre: {
                    [Op.like]: `%${filter}%`
                },
                ID_Planificacion: idPlan
            }
        });

        if (all.length === 0) {
            const error = new Error('No hay actividades');
            error.status = 404;
            throw error;
        }

        return all;
    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al obtener actividades por filtro');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const crearActividad = async (actividad) => {

    try {
        if (!actividad.ID_Planificacion || !actividad.Nombre) {
            const error = new Error('ID_Planificacion y Nombre son requeridos');
            error.status = 400;
            throw error;
        }

        const act = await Actividades.create({
            ID_Planificacion: actividad.ID_Planificacion,
            Nombre: actividad.Nombre,
            FechaPlaneada: actividad.FechaPlaneada,
            Descripcion: actividad.Descripcion,
            Duracion: actividad.Duracion,
        });

        return act.dataValues;

    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al crear una Actividad');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const actualizarActividad = async (id, actividad, userId) => {
    try {
        const act = await Actividades.findByPk(id);
        if (!act) {
            const error = new Error('Actividad no encontrada');
            error.status = 404;
            throw error;
        }
        // Nuevo agregado para validar que la planificacion pertenezca al usuario, NO FUE PROBADA EN EL TEST
        const planificacion = await Planificaciones.findOne({
            where: {
                ID: act.ID_Planificacion,
                ID_Usuario: userId
            }
        });

        if (!planificacion) {
            const error = new Error('No pertenece al usuario');
            error.status = 404;
            throw error;
        }
        // Fin del nuevo agregado

        act.Nombre = actividad.Nombre;
        act.FechaPlaneada = actividad.FechaPlaneada;
        act.Descripcion = actividad.Descripcion;
        act.Duracion = actividad.Duracion;

        await act.save();
        return act.dataValues;

    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error("Error al actualizar una actividad");
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const eliminarActividad = async (id) => {
    try {
        const act = await Actividades.findByPk(id);
        if (!act) {
            const error = new Error('Actividad no encontrada');
            error.status = 404;
            throw error;
        }

        await act.destroy();
        return { message: 'Actividad eliminada' };
    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al eliminar una actividad');
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
    crearActividad,
    actualizarActividad,
    eliminarActividad
};
