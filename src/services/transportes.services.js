import Transportes from "../models/transportes.models.js";
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

        const all = await Transportes.findAll({
            where: {
                ID_Planificacion: idPlan
            }
        });
        if (all.length === 0) {
            const error = new Error('No hay transportes');
            error.status = 404;
            throw error;
        }
        return all;
    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al obtener todos los transportes');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const getById = async (id, userId) => {
    try {
        const transporte = await Transportes.findByPk(id);
        if (!transporte) {
            const error = new Error('Transporte no encontrado');
            error.status = 404;
            throw error;
        }
        // Nuevo agregado para validar que la planificacion pertenezca al usuario, NO FUE PROBADA EN EL TEST
        const planificacion = await Planificaciones.findOne({
            where: {
                ID: transporte.ID_Planificacion,
                ID_Usuario: userId
            }
        });

        if (!planificacion) {
            const error = new Error('Planificación no encontrada o no pertenece al usuario');
            error.status = 404;
            throw error;
        }
        // Fin del nuevo agregado
        return transporte;
    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al obtener el transporte por ID');
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

        const all = await Transportes.findAll({
            where: {
                Nombre: {
                    [Op.like]: `%${filter}%`
                },
                ID_Planificacion: idPlan
            }
        });

        if (all.length === 0) {
            const error = new Error('No hay transportes');
            error.status = 404;
            throw error;
        }

        return all;
    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al obtener transportes por filtro');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const crearTransporte = async (body) => {
    try {
        if (!body.ID_Planificacion || !body.Nombre || !body.FechaSalida || !body.Origen || !body.Destino || !body.Tipo) {
            const error = new Error('ID_Planificacion, Nombre, FechaSalida, Origen, Destino y Tipo son obligatorios');
            error.status = 400;
            throw error;
        }

        const transporte = await Transportes.create({
            ID_Planificacion: body.ID_Planificacion,
            Nombre: body.Nombre,
            FechaSalida: body.FechaSalida,
            Origen: body.Origen,
            Destino: body.Destino,
            Tipo: body.Tipo
        });

        return transporte.dataValues;

    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al crear un transporte');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const actualizarTransporte = async (id, body, userId) => {
    try {
        const transporte = await Transportes.findByPk(id);
        if (!transporte) {
            const error = new Error('Transporte no encontrado');
            error.status = 404;
            throw error;
        }
        // Nuevo agregado para validar que la planificacion pertenezca al usuario, NO FUE PROBADA EN EL TEST
        const planificacion = await Planificaciones.findOne({
            where: {
                ID: transporte.ID_Planificacion,
                ID_Usuario: userId
            }
        });

        if (!planificacion) {
            const error = new Error('No pertenece al usuario');
            error.status = 404;
            throw error;
        }
        // Fin del nuevo agregado

        transporte.Nombre = body.Nombre;
        transporte.FechaSalida = body.FechaSalida;
        transporte.Origen = body.Origen;
        transporte.Destino = body.Destino;
        transporte.Tipo = body.Tipo;

        await transporte.save();
        return transporte.dataValues;
    }
    catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al actualizar un transporte');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const eliminarTransporte = async (id) => {
    try {
        const transporte = await Transportes.findByPk(id);
        if (!transporte) {
            const error = new Error('Transporte no encontrado');
            error.status = 404;
            throw error;
        }
        await transporte.destroy();
        return { message: "Transporte eliminado" };
    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al eliminar un transporte');
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
    crearTransporte,
    actualizarTransporte,
    eliminarTransporte
};