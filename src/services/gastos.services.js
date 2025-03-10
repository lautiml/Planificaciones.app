import Gastos from "../models/gastos.models.js";
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

        const all = await Gastos.findAll({
            where: {
                ID_Planificacion: idPlan
            }
        });
        if (all.length === 0) {
            const error = new Error('No hay gastos');
            error.status = 404;
            throw error;
        }
        return all;
    } catch (error) {
        console.error(error);
        if (error.status === 404) {
            throw error;
        } else {
            const newError = new Error('Error al obtener todos los gastos');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const getById = async (id, userId) => {
    try {
        const gasto = await Gastos.findByPk(id);
        if (!gasto) {
            const error = new Error('Gasto no encontrado');
            error.status = 404;
            throw error;
        }
        // Nuevo agregado para validar que la planificacion pertenezca al usuario, NO FUE PROBADA EN EL TEST
        const planificacion = await Planificaciones.findOne({
            where: {
                ID: gasto.ID_Planificacion,
                ID_Usuario: userId
            }
        });

        if (!planificacion) {
            const error = new Error('Planificación no encontrada o no pertenece al usuario');
            error.status = 404;
            throw error;
        }
        // Fin del nuevo agregado
        return gasto;
    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al obtener el gasto por ID');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    };
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

        const all = await Gastos.findAll({
            where: {
                Descripcion: {
                    [Op.like]: `%${filter}%`
                },
                ID_Planificacion: idPlan
            }
        });

        if (all.length === 0) {
            const error = new Error('No hay gastos con esa descripción');
            error.status = 404;
            throw error;
        }

        return all;
    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al obtener gastos por filtro');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const crearGasto = async (gasto) => {
    try {
        if (!gasto.ID_Planificacion || !gasto.Monto) {
            const error = new Error('ID_Planificacion y Monto son requeridos');
            error.status = 400;
            throw error;
        }

        const gas = await Gastos.create({
            ID_Planificacion: gasto.ID_Planificacion,
            Monto: gasto.Monto,
            FechaRegistro: gasto.FechaRegistro,
            Descripcion: gasto.Descripcion,

        });

        return gas.dataValues;

    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al crear un gasto');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const actualizarGasto = async (id, gasto, userId) => {
    try {
        const gas = await Gastos.findByPk(id);
        if (!gas) {
            const error = new Error('Gasto no encontrado');
            error.status = 404;
            throw error;
        }
        // Nuevo agregado para validar que la planificacion pertenezca al usuario, NO FUE PROBADA EN EL TEST
        const planificacion = await Planificaciones.findOne({
            where: {
                ID: gas.ID_Planificacion,
                ID_Usuario: userId
            }
        });

        if (!planificacion) {
            const error = new Error('No pertenece al usuario');
            error.status = 404;
            throw error;
        }
        // Fin del nuevo agregado
        gas.Monto = gasto.Monto;
        gas.FechaRegistro = gasto.FechaRegistro;
        gas.Descripcion = gasto.Descripcion;

        await gas.save();
        return gas.dataValues;

    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al actualizar un gasto');
            newError.status = 500;
            newError.originalError = error;
            throw newError;
        }
    }
};

const eliminarGasto = async (id) => {
    try {
        const gas = await Gastos.findByPk(id);
        if (!gas) {
            const error = new Error('gasto no encontrado');
            error.status = 404;
            throw error;
        }

        await gas.destroy();
        return { message: 'Gasto eliminado' };
    } catch (error) {
        console.error(error);
        if (error.status) {
            throw error;
        } else {
            const newError = new Error('Error al eliminar un gasto');
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
    crearGasto,
    actualizarGasto,
    eliminarGasto
};