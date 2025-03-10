import request from 'supertest';
import app from '../index.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const gastosAlta = {
    ID_Planificacion: 1,
    Monto: 1000,
    Descripcion: "Gastos Test",
};

const gastosModificacion = {
    Monto: 1500,
    Descripcion: "Gastos Test Modificado",
    FechaRegistro: "2024-06-30",
};

let gastoCreado;

// Test de creacion de un gasto
describe('POST /gastos/crear', () => {

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
        const response = await request(app).post('/gastos/crear').set("Cookie", `user=${token}`).send(gastosAlta);
        gastoCreado = response.body;
        expect(response.statusCode).toBe(200);
    });

    test('Debería responder con un objeto de gasto', async () => {
        expect(gastoCreado).toEqual(
            expect.objectContaining({
                ID: expect.any(Number),
                ID_Planificacion: expect.any(Number),
                Monto: expect.any(Number),
                FechaRegistro: expect.any(String),
                Descripcion: expect.any(String),
            }),
        );
    });

    test('Debería responder con un código 400 si falta algún campo', async () => {
        const response = await request(app).post('/gastos/crear').set("Cookie", `user=${token}`).send({
            ID_Planificacion: 1,
        });
        expect(response.statusCode).toBe(400);
    });
});

// Test de obtencion de gastos
describe('GET /gastos/obtenerTodos/:id', () => {

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
        const response = await request(app).get('/gastos/obtenerTodos/1').set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(200);
    });

    test('Debería responder con un arreglo de gastos', async () => {
        const response = await request(app).get('/gastos/obtenerTodos/1').set("Cookie", `user=${token}`).send();
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    ID: expect.any(Number),
                    ID_Planificacion: expect.any(Number),
                    Monto: expect.any(Number),
                    FechaRegistro: expect.any(String),
                    Descripcion: expect.any(String),
                }),
            ]),
        );
    });

    test('Debería responder con un codigo 404 si no hay gastos', async () => {
        const response = await request(app).get('/gastos/obtenerTodos/999').set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(404);
    });
});

// Test de obtencion de un gasto por ID
describe('GET /gastos/obtenerById/:id', () => {

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
        const response = await request(app).get(`/gastos/obtenerById/${gastoCreado.ID}`).set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(200);
    });

    test('Debería responder con un objeto de gasto', async () => {
        const response = await request(app).get(`/gastos/obtenerById/${gastoCreado.ID}`).set("Cookie", `user=${token}`).send();
        expect(response.body).toEqual(
            expect.objectContaining({
                ID: expect.any(Number),
                ID_Planificacion: expect.any(Number),
                Monto: expect.any(Number),
                FechaRegistro: expect.any(String),
                Descripcion: expect.any(String),
            }),
        );
    });

    test('Debería responder con un código 404 si el gasto no existe', async () => {
        const response = await request(app).get('/gastos/obtenerById/999').set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(404);
    });
});

// Test de modificacion de un gasto
describe('PUT /gastos/modificar/:id', () => {

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
        const response = await request(app).put(`/gastos/modificar/${gastoCreado.ID}`).set("Cookie", `user=${token}`).send(gastosModificacion);
        expect(response.statusCode).toBe(200);
    });

    test('Debería responder con un objeto de gasto', async () => {
        const response = await request(app).put(`/gastos/modificar/${gastoCreado.ID}`).set("Cookie", `user=${token}`).send(gastosModificacion);
        expect(response.body).toEqual(
            expect.objectContaining({
                Monto: expect.any(Number),
                Descripcion: expect.any(String),
            }),
        );
    });

    test('Debería responder con un código 404 si el gasto no existe', async () => {
        const response = await request(app).put('/gastos/modificar/999').set("Cookie", `user=${token}`).send(gastosModificacion);
        expect(response.statusCode).toBe(404);
    });
});

// Test de eliminacion de un gasto
describe(`DELETE /gastos/eliminar/:id`, () => {

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
        const response = await request(app).delete(`/gastos/eliminar/${gastoCreado.ID}`).set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                message: 'Gasto eliminado',
            }),
        );
    });

    test('Debería responder con un código 404 si el gasto no existe', async () => {
        const response = await request(app).delete('/gastos/eliminar/999').set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(404);
    });
});