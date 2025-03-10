import express from "express";
import services from "../services/usuarios.services.js";
import auth from "../middlewares/authorization.js";

const router = express.Router(); // en este router defino ENDPOINTS

// obtener todos los usuarios
router.get("/obtenerTodos", async (req, res) => {
    try {
        const usuarios = await services.getAll(req);
        res.json(usuarios);
    } catch (error) {
        res.status(error.status).json({ error: error.message });
    }
});

router.get("/obtenerById/:id", async (req, res) => {
    try {
        const usuario = await services.getById(req.params.id);
        res.json(usuario);
    } catch (error) {
        res.status(error.status).json({ error: error.message });
    }
});

// crear un nuevo usuario, a traves de lo que este en el cuerpo de la peticion
router.post("/crear", async (req, res) => {
    try {
        const usuario = await services.crearUsuario(req.body);
        res.json(usuario);
    } catch (error) {
        res.status(error.status).json({ error: error.message });
    }
});

router.delete("/eliminar/:id", auth.logueado ,async (req, res) => {
    try {
        const response = await services.eliminarUsuario(req.params.id);
        return res.json(response);
    } catch (error) {
        return res.status(error.status).json({ error: error.message });
    }
});

router.put("/modificar/:id", auth.logueado ,async (req, res) => {
    try {
        const response = await services.actualizarUsuario(req.params.id, req.body);
        return res.json(response);
    } catch (error) {
        return res.status(error.status).json({ error: error.message });
    }
});

export default router;