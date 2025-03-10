import request from 'supertest';
import app from '../index.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const destinosAlta = {
    ID_Planificacion: 1,
    Nombre: "Destinos Test",
    FechaInicio: "2022-01-01",
    FechaFin: "2022-01-10",
};

const destinosModificacion = {
    Nombre: "Destinos Test Modificado",
    FechaInicio: "2022-02-01",
    FechaFin: "2022-02-10",
};

let destinoCreado;

// Test de creacion de un destino
describe('POST /destinos/crear', () => {

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
        const response = await request(app).post('/destinos/crear').set("Cookie", `user=${token}`).send(destinosAlta);
        destinoCreado = response.body;
        expect(response.statusCode).toBe(200);
    });

    test('Debería responder con un objeto de destino', async () => {
        expect(destinoCreado).toEqual(
            expect.objectContaining({
                ID: expect.any(Number),
                ID_Planificacion: expect.any(Number),
                Nombre: expect.any(String),
                FechaInicio: expect.any(String),
                FechaFin: expect.any(String),
            }),
        );
    });

    test('Debería responder con un código 400 si falta algún campo', async () => {
        const response = await request(app).post('/destinos/crear').set("Cookie", `user=${token}`).send({
            ID_Planificacion: 1,
        });
        expect(response.statusCode).toBe(400);
    });
});

// Test de obtencion de destinos
describe('GET /destinos/obtenerTodos/:id', () => {

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
        const response = await request(app).get('/destinos/obtenerTodos/1').set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(200);
    });

    test('Debería responder con un arreglo de destinos', async () => {
        const response = await request(app).get('/destinos/obtenerTodos/1').set("Cookie", `user=${token}`).send();
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    ID: expect.any(Number),
                    ID_Planificacion: expect.any(Number),
                    Nombre: expect.any(String),
                    FechaInicio: expect.any(String),
                    FechaFin: expect.any(String),
                }),
            ]),
        );
    });

    test('Debería responder con un código 404 si no hay destinos', async () => {
        const response = await request(app).get('/destinos/obtenerTodos/999').set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(404);
    });
});

// Test de obtencion de un destino por ID
describe('GET /destinos/obtenerById/:id', () => {

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
        const response = await request(app).get(`/destinos/obtenerById/${destinoCreado.ID}`).set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(200);
    });

    test('Debería responder con un objeto de destino', async () => {
        const response = await request(app).get(`/destinos/obtenerById/${destinoCreado.ID}`).set("Cookie", `user=${token}`).send();
        expect(response.body).toEqual(
            expect.objectContaining({
                ID: expect.any(Number),
                ID_Planificacion: expect.any(Number),
                Nombre: expect.any(String),
                FechaInicio: expect.any(String),
                FechaFin: expect.any(String),
            }),
        );
    });

    test('Debería responder con un código 404 si el destino no existe', async () => {
        const response = await request(app).get('/destinos/obtenerById/999').set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(404);
    });
});

// Test de modificacion de un destino
describe('PUT /destinos/modificar/:id', () => {

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
        const response = await request(app).put(`/destinos/modificar/${destinoCreado.ID}`).set("Cookie", `user=${token}`).send(destinosModificacion);
        expect(response.statusCode).toBe(200);
    });

    test('Debería responder con un objeto de destino', async () => {
        const response = await request(app).put(`/destinos/modificar/${destinoCreado.ID}`).set("Cookie", `user=${token}`).send(destinosModificacion);
        expect(response.body).toEqual(
            expect.objectContaining({
                Nombre: expect.any(String),
                FechaInicio: expect.any(String),
                FechaFin: expect.any(String),
            }),
        );
    });

    test('Debería responder con un código 404 si el destino no existe', async () => {
        const response = await request(app).put('/destinos/modificar/999').set("Cookie", `user=${token}`).send(destinosModificacion);
        expect(response.statusCode).toBe(404);
    });
});

// Test de eliminacion de un destino
describe(`DELETE /destinos/eliminar/:id`, () => {

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
        const response = await request(app).delete(`/destinos/eliminar/${destinoCreado.ID}`).set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                message: 'Destino eliminado',
            }),
        );
    });

    test('Debería responder con un código 404 si el destino no existe', async () => {
        const response = await request(app).delete('/destinos/eliminar/999').set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(404);
    });
});