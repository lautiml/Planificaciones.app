import request from 'supertest';
import app from '../index.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const planificacionAlta = {
    Nombre: "Planificacion Test 2",
    FechaInicio: "2021-12-01",
    FechaFin: "2021-12-31",
    Descripcion: "Planificacion de prueba 2",
};

const planificacionModificacion = {
    Nombre: "Planificacion Test 2 Modificado",
    FechaInicio: "2021-12-01",
    FechaFin: "2021-12-31",
    Descripcion: "Planificacion de prueba 2 modificada",
};

let planificacionCreada;

// Test de creacion de una planificacion
describe('POST /planificaciones/crear', () => {

    let token;

    beforeAll(() => {
        // Generar un token de prueba para autenticación
        token = jwt.sign({
            Id: 1,
            Nombre: 'Usuario Test',
            Email: 'usuario.test@gmail.com'
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION
        });
    });

    test('Debería responder con un código 200', async () => {
        const response = await request(app).post('/planificaciones/crear').set("Cookie", `user=${token}`).send(planificacionAlta);
        planificacionCreada = response.body;
        expect(response.statusCode).toBe(200);
    });

    test('Debería responder con un objeto de planificacion', async () => {
        expect(planificacionCreada).toEqual(
            expect.objectContaining({
                ID: expect.any(Number),
                ID_Usuario: expect.any(Number),
                Nombre: expect.any(String),
                FechaRegistro: expect.any(String),
                FechaInicio: expect.any(String),
                FechaFin: expect.any(String),
                Descripcion: expect.any(String),
            }),
        );
    });

    test('Debería responder con un código 400 si falta algún campo', async () => {
        const response = await request(app).post('/planificaciones/crear').set("Cookie", `user=${token}`).send({
            Nombre: "",
        });
        expect(response.statusCode).toBe(400);
    });
});

// Test de obtencion de planificaciones
describe('GET /planificaciones/obtenerTodos', () => {
    let token;

    beforeAll(() => {
        // Generar un token de prueba para autenticación
        token = jwt.sign({
            Id: 1,
            Nombre: 'Usuario Test',
            Email: 'usuario.test@gmail.com'
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION
        });
    });

    test('Debería responder con un código 200', async () => {
        const response = await request(app).get('/planificaciones/obtenerTodos').set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(200);
    });

    test('Debería responder con un arreglo de planificaciones', async () => {
        const response = await request(app).get('/planificaciones/obtenerTodos').set("Cookie", `user=${token}`).send();
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    ID: expect.any(Number),
                    ID_Usuario: expect.any(Number),
                    Nombre: expect.any(String),
                    FechaRegistro: expect.any(String),
                    FechaInicio: expect.any(String),
                    FechaFin: expect.any(String),
                    Descripcion: expect.any(String),
                }),
            ]),
        );
    });

    /* No funciona ya que habria que cambiar de sesion o eliminar todas las planificaciones para que no haya ninguna

    test('Debería responder con un codigo 404 si no hay planificaciones', async () => {
        const response = await request(app).get('/planificaciones/obtenerTodos').send();
        expect(response.statusCode).toBe(404);
    });*/
});

// Test de obtencion de una planificacion por ID
describe('GET /planificaciones/obtenerById/:id', () => {

    let token;

    beforeAll(() => {
        // Generar un token de prueba para autenticación
        token = jwt.sign({
            Id: 1,
            Nombre: 'Usuario Test',
            Email: 'usuario.test@gmail.com'
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION
        });
    });

    test('Debería responder con un código 200', async () => {
        const response = await request(app).get(`/planificaciones/obtenerById/${planificacionCreada.ID}`).set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(200);
    });

    test('Debería responder con un objeto de planificacion', async () => {
        const response = await request(app).get(`/planificaciones/obtenerById/${planificacionCreada.ID}`).set("Cookie", `user=${token}`).send();
        expect(response.body).toEqual(
            expect.objectContaining({
                ID: expect.any(Number),
                ID_Usuario: expect.any(Number),
                Nombre: expect.any(String),
                FechaRegistro: expect.any(String),
                FechaInicio: expect.any(String),
                FechaFin: expect.any(String),
                Descripcion: expect.any(String),
            }),
        );
    });

    test('Debería responder con un código 404 si la planificacion no existe o no pertenece al usuario en sesion', async () => {
        const response = await request(app).get('/planificaciones/obtenerById/999').set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(404);
    });
});

// Test de modificacion de una planficacion
describe('PUT /planificaciones/modificar/:id', () => {

    let token;

    beforeAll(() => {
        // Generar un token de prueba para autenticación
        token = jwt.sign({
            Id: 1,
            Nombre: 'Usuario Test',
            Email: 'usuario.test@gmail.com'
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION
        });
    });

    test('Debería responder con un código 200', async () => {
        const response = await request(app).put(`/planificaciones/modificar/${planificacionCreada.ID}`).set("Cookie", `user=${token}`).send(planificacionModificacion);
        expect(response.statusCode).toBe(200);
    });

    test('Debería responder con un objeto de planificacion', async () => {
        const response = await request(app).put(`/planificaciones/modificar/${planificacionCreada.ID}`).set("Cookie", `user=${token}`).send(planificacionModificacion);
        expect(response.body).toEqual(
            expect.objectContaining({
                Nombre: expect.any(String),
                FechaInicio: expect.any(String),
                FechaFin: expect.any(String),
                Descripcion: expect.any(String),
            }),
        );
    });

    test('Debería responder con un código 404 si la planificacion no existe o no pertenece al usuario en sesion', async () => {
        const response = await request(app).put('/planificaciones/modificar/999').set("Cookie", `user=${token}`).send(planificacionModificacion);
        expect(response.statusCode).toBe(404);
    });
});

// Test de eliminacion de una planificacion
describe(`DELETE /planificaciones/eliminar/:id`, () => {

    let token;

    beforeAll(() => {
        // Generar un token de prueba para autenticación
        token = jwt.sign({
            Id: 1,
            Nombre: 'Usuario Test',
            Email: 'usuario.test@gmail.com'
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION
        });
    });
    
    test('Debería responder con un código 200', async () => {
        const response = await request(app).delete(`/planificaciones/eliminar/${planificacionCreada.ID}`).set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                message: 'Planificacion eliminada',
            }),
        );
    });

    test('Debería responder con un código 404 si la planificacion no existe o no pertenece al usuario en sesion', async () => {
        const response = await request(app).delete('/planificaciones/eliminar/999').set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(404);
    });
});