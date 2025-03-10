import request from 'supertest';
import app from '../index.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const actividadesAlta = {
    ID_Planificacion: 1,
    Nombre: "Actividades Test",
    FechaPlaneada: "2022-01-01",
    Descripcion: "Actividades Test",
    Duracion: "01:00:00",
};

const actividadesModificacion = {
    Nombre: "Actividades Test Modificado",
    FechaPlaneada: "2022-01-01",
    Descripcion: "Actividades Test Modificado",
    Duracion: "02:00:00",
};

let actividadCreado;

// Test de creacion de un actividad
describe('POST /actividades/crear', () => {

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
        const response = await request(app).post('/actividades/crear').set("Cookie", `user=${token}`).send(actividadesAlta);
        actividadCreado = response.body;
        expect(response.statusCode).toBe(200);
    });

    test('Debería responder con un objeto de actividad', async () => {
        expect(actividadCreado).toEqual(
            expect.objectContaining({
                ID: expect.any(Number),
                ID_Planificacion: expect.any(Number),
                Nombre: expect.any(String),
                FechaPlaneada: expect.any(String),
                FechaRegistro: expect.any(String),
                Descripcion: expect.any(String),
                Duracion: expect.any(String),
            }),
        );
    });

    test('Debería responder con un código 400 si falta algún campo', async () => {
        const response = await request(app).post('/actividades/crear').set("Cookie", `user=${token}`).send({
            ID_Planificacion: 1,
        });
        expect(response.statusCode).toBe(400);
    });
});

// Test de obtencion de actividades
describe('GET /actividades/obtenerTodos/:id', () => {

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
        const response = await request(app).get('/actividades/obtenerTodos/1').set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(200);
    });

    test('Debería responder con un arreglo de actividades', async () => {
        const response = await request(app).get('/actividades/obtenerTodos/1').set("Cookie", `user=${token}`).send();
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    ID: expect.any(Number),
                    ID_Planificacion: expect.any(Number),
                    Nombre: expect.any(String),
                    FechaPlaneada: expect.any(String),
                    FechaRegistro: expect.any(String),
                    Descripcion: expect.any(String),
                    Duracion: expect.any(String),
                }),
            ]),
        );
    });

    test('Debería responder con código 404 si no hay actividades', async () => {
        const response = await request(app).get('/actividades/obtenerTodos/999').set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(404);
    });
});

// Test de obtencion de un actividad por ID
describe('GET /actividades/obtenerById/:id', () => {

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
        const response = await request(app).get(`/actividades/obtenerById/${actividadCreado.ID}`).set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(200);
    });

    test('Debería responder con un objeto de actividad', async () => {
        const response = await request(app).get(`/actividades/obtenerById/${actividadCreado.ID}`).set("Cookie", `user=${token}`).send();
        expect(response.body).toEqual(
            expect.objectContaining({
                ID: expect.any(Number),
                ID_Planificacion: expect.any(Number),
                Nombre: expect.any(String),
                FechaPlaneada: expect.any(String),
                FechaRegistro: expect.any(String),
                Descripcion: expect.any(String),
                Duracion: expect.any(String),
            }),
        );
    });

    test('Debería responder con un código 404 si el actividad no existe', async () => {
        const response = await request(app).get('/actividades/obtenerById/999').set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(404);
    });
});

// Test de modificacion de un actividad
describe('PUT /actividades/modificar/:id', () => {

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
        const response = await request(app).put(`/actividades/modificar/${actividadCreado.ID}`).set("Cookie", `user=${token}`).send(actividadesModificacion);
        expect(response.statusCode).toBe(200);
    });

    test('Debería responder con un objeto de actividad', async () => {
        const response = await request(app).put(`/actividades/modificar/${actividadCreado.ID}`).set("Cookie", `user=${token}`).send(actividadesModificacion);
        expect(response.body).toEqual(
            expect.objectContaining({
                Nombre: expect.any(String),
                FechaPlaneada: expect.any(String),
                Descripcion: expect.any(String),
                Duracion: expect.any(String),
            }),
        );
    });

    test('Debería responder con un código 404 si la actividad no existe', async () => {
        const response = await request(app).put('/actividades/modificar/999').set("Cookie", `user=${token}`).send(actividadesModificacion);
        expect(response.statusCode).toBe(404);
    });
});

// Test de eliminacion de un actividad
describe(`DELETE /actividades/eliminar/:id`, () => {

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
        const response = await request(app).delete(`/actividades/eliminar/${actividadCreado.ID}`).set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                message: 'Actividad eliminada',
            }),
        );
    });

    test('Debería responder con un código 404 si la actividad no existe', async () => {
        const response = await request(app).delete('/actividades/eliminar/999').set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(404);
    });
});