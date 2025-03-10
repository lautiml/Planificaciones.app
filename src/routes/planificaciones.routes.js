import express from "express";
import services from "../services/planificaciones.services.js";
import auth from "../middlewares/authorization.js";

const router = express.Router(); // en este router defino ENDPOINTS

router.get("/obtenerTodos", auth.logueado, async (req, res) => {
    try {
        const usuarios = await services.getAll(req.userId);
        res.json(usuarios);
    } catch (error) {
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
router.get("/obtenerByFilter/:filter", auth.logueado, async (req, res) => {
    try {
        const usuarios = await services.getByFilter(req.params.filter, req.userId);
        res.json(usuarios);
    } catch (error) {
        res.status(error.status).json({ error: error.message });
    }
});

router.post("/crear", auth.logueado, async (req, res) => {
    try {
        const usuario = await services.crearPlanificacion(req.body, req.userId);
        res.json(usuario);
    } catch (error) {
        res.status(error.status).json({ error: error.message });
    }
});

router.delete("/eliminar/:id", auth.logueado, async (req, res) => {
    try {
        const response = await services.eliminarPlanificacion(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(error.status).json({ error: error.message });
    }
});

router.put("/modificar/:id", auth.logueado, async (req, res) => {
    try {
        const response = await services.actualizarPlanificacion(req.params.id, req.body);
        return res.json(response);
    } catch (error) {
        return res.status(error.status).json({ error: error.message });
    }
});

export default router;