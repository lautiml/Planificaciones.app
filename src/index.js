import express from "express";
import cors from "cors";
import sequelize from "./databases/database.js";
import cookieParser from "cookie-parser";
import login from "./services/authentication.services.js";

// Importar rutas
import gastosRouter from "./routes/gastos.routes.js";
import destinosRouter from "./routes/destinos.routes.js";
import actividadesRouter from "./routes/actividades.routes.js";
import hospedajesRouter from "./routes/hospedajes.routes.js";
import planificacionesRouter from "./routes/planificaciones.routes.js";
import transportesRouter from "./routes/transportes.routes.js";
import serviciosRouter from "./routes/servicios.routes.js";
import usuariosRouter from "./routes/usuarios.routes.js";

// Inicializar express
const app = express();

// Configuración de CORS
const corsOptions = {
    origin: 'http://localhost:3000',  // Especifica el origen permitido
    credentials: true,  // Habilita el intercambio de credenciales (cookies, etc.)
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// Rutas del servidor
app.use(`/gastos`, gastosRouter);
app.use(`/destinos`, destinosRouter);
app.use(`/actividades`, actividadesRouter);
app.use(`/hospedajes`, hospedajesRouter);
app.use(`/planificaciones`, planificacionesRouter);
app.use(`/transportes`, transportesRouter);
app.use(`/servicios`, serviciosRouter);
app.use(`/usuarios`, usuariosRouter);

// Ruta de inicio
app.get("/", (req, res) => {
    const htmlResponse = '<html><head><title>Backend</title></head><body>API Funcionando</body></html>';
    res.send(htmlResponse);
});

// Ruta de logueo
app.post("/login", login);

// Iniciar servidor
if (process.env.NODE_ENV !== 'test') {
    app.listen(4001, async () => {
        await sequelize.sync();
        console.log(`Servidor iniciado en: http://localhost:4001`);
    });
}

export default app;