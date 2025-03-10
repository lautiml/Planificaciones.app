import request from 'supertest';
import app from '../index.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const hospedajeAlta = {
    ID_Planificacion: 1,
    Nombre: "Hospedaje Test",
    Descripcion: "Hospedaje Test",
    Tipo: "Hospedaje",
    Precio: 1000,
    FechaInicio: "2022-01-01",
    FechaFin: "2022-01-10",
};

const hospedajeModificacion = {
    Nombre: "Hospedaje Test Modificado",
    Descripcion: "Hospedaje Test Modificado",
    Tipo: "Hospedaje Modificado",
    Precio: 1500,
    FechaInicio: "2022-01-01",
    FechaFin: "2022-01-10",
};

let hospedajeCreado;

// Test de creacion de un hospedaje
describe('POST /hospedajes/crear', () => {

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
        const response = await request(app).post('/hospedajes/crear').set("Cookie", `user=${token}`).send(hospedajeAlta);
        hospedajeCreado = response.body;
        expect(response.statusCode).toBe(200);
    });

    test('Debería responder con un objeto de hospedaje', async () => {
        expect(hospedajeCreado).toEqual(
            expect.objectContaining({
                ID: expect.any(Number),
                ID_Planificacion: expect.any(Number),
                Nombre: expect.any(String),
                Descripcion: expect.any(String),
                Tipo: expect.any(String),
                Precio: expect.any(Number),
                FechaInicio: expect.any(String),
                FechaFin: expect.any(String),
            }),
        );
    });

    test('Debería responder con un código 400 si falta algún campo', async () => {
        const response = await request(app).post('/hospedajes/crear').set("Cookie", `user=${token}`).send({
            ID_Planificacion: 1,
        });
        expect(response.statusCode).toBe(400);
    });
});

// Test de obtencion de hospedajes
describe('GET /hospedajes/obtenerTodos/:id', () => {

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
        const response = await request(app).get('/hospedajes/obtenerTodos/1').set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(200);
    });

    test('Debería responder con un arreglo de hospedajes', async () => {
        const response = await request(app).get('/hospedajes/obtenerTodos/1').set("Cookie", `user=${token}`).send();
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    ID: expect.any(Number),
                    ID_Planificacion: expect.any(Number),
                    Nombre: expect.any(String),
                    Descripcion: expect.any(String),
                    Tipo: expect.any(String),
                    Precio: expect.any(Number),
                    FechaInicio: expect.any(String),
                    FechaFin: expect.any(String),
                }),
            ]),
        );
    });

    test('Debería responder con un codigo 404 si no hay hospedajes', async () => {
        const response = await request(app).get('/hospedajes/obtenerTodos/999').set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(404);
    });
});

// Test de obtencion de un hospedaje por ID
describe('GET /hospedajes/obtenerById/:id', () => {

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
        const response = await request(app).get(`/hospedajes/obtenerById/${hospedajeCreado.ID}`).set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(200);
    });

    test('Debería responder con un objeto de hospedaje', async () => {
        const response = await request(app).get(`/hospedajes/obtenerById/${hospedajeCreado.ID}`).set("Cookie", `user=${token}`).send();
        expect(response.body).toEqual(
            expect.objectContaining({
                ID: expect.any(Number),
                ID_Planificacion: expect.any(Number),
                Nombre: expect.any(String),
                Descripcion: expect.any(String),
                Tipo: expect.any(String),
                Precio: expect.any(Number),
                FechaInicio: expect.any(String),
                FechaFin: expect.any(String),
            }),
        );
    });

    test('Debería responder con un código 404 si el hospedaje no existe', async () => {
        const response = await request(app).get('/hospedajes/obtenerById/999').set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(404);
    });
});

// Test de modificacion de un hospedaje
describe('PUT /hospedajes/modificar/:id', () => {

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
        const response = await request(app).put(`/hospedajes/modificar/${hospedajeCreado.ID}`).set("Cookie", `user=${token}`).send(hospedajeModificacion);
        expect(response.statusCode).toBe(200);
    });

    test('Debería responder con un objeto de hospedaje', async () => {
        const response = await request(app).put(`/hospedajes/modificar/${hospedajeCreado.ID}`).set("Cookie", `user=${token}`).send(hospedajeModificacion);
        expect(response.body).toEqual(
            expect.objectContaining({
                Nombre: expect.any(String),
                Descripcion: expect.any(String),
                Tipo: expect.any(String),
                Precio: expect.any(Number),
                FechaInicio: expect.any(String),
                FechaFin: expect.any(String),
            }),
        );
    });

    test('Debería responder con un código 404 si el hospedaje no existe', async () => {
        const response = await request(app).put('/hospedajes/modificar/999').set("Cookie", `user=${token}`).send(hospedajeModificacion);
        expect(response.statusCode).toBe(404);
    });
});

// Test de eliminacion de un hospedaje
describe(`DELETE /hospedajes/eliminar/:id`, () => {

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
        const response = await request(app).delete(`/hospedajes/eliminar/${hospedajeCreado.ID}`).set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                message: 'Hospedaje eliminado',
            }),
        );
    });

    test('Debería responder con un código 404 si el hospedaje no existe', async () => {
        const response = await request(app).delete('/hospedajes/eliminar/999').set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(404);
    });
});