import express from "express";
import services from "../services/hospedajes.services.js";
import auth from "../middlewares/authorization.js";

const router = express.Router(); // en este router defino ENDPOINTS

// obtener todos los usuarios
router.get("/obtenerTodos/:idPlan", auth.logueado, async (req, res) => {
    try {
        const usuarios = await services.getAll(req.params.idPlan, req.userId);
        res.json(usuarios);
    } catch (error) {
        console.log(error);
        res.status(error.status).json({ error: error.message });
    }
});

router.get("/obtenerById/:id", auth.logueado, async (req, res) => {
    try {
        const usuario = await services.getById(req.params.id, req.userId);
        res.json(usuario);
    } catch (error) {
        res.status(error.status).json({ error: error.message });
    }
});

// Endpoint para obtener planificaciones por filtro
router.get("/obtenerByFilter/:filter/:idPlan", auth.logueado, async (req, res) => {
    try {
        const usuarios = await services.getByFilter(req.params.filter, req.params.idPlan, req.userId);
        res.json(usuarios);
    } catch (error) {
        res.status(error.status).json({ error: error.message });
    }
});

// crear un nuevo usuario, a traves de lo ue este en el cuerpo de la peticion
router.post("/crear", auth.logueado, async (req, res) => {
    try {
        const usuario = await services.crearHospedaje(req.body);
        res.json(usuario);
    } catch (error) {
        res.status(error.status).json({ error: error.message });
    }
});

router.delete("/eliminar/:id", auth.logueado, async (req, res) => {
    try {
        const response = await services.eliminarHospedaje(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(error.status).json({ error: error.message });
    }
});

router.put("/modificar/:id", auth.logueado, async (req, res) => {
    try {
        const response = await services.actualizarHospedaje(req.params.id, req.body, req.userId);
        return res.json(response);
    } catch (error) {
        return res.status(error.status).json({ error: error.message });
    }
});

export default router;