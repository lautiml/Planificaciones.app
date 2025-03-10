import request from 'supertest';
import app from '../index.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const transporteAlta = {
    ID_Planificacion: 1,
    Nombre: "Transporte Test",
    FechaSalida: "2021-11-01",
    Origen: "Origen Test",
    Destino: "Destino Test",
    Tipo: "Tipo Test",
};

const transporteModificacion = {
    Nombre: "Transporte Test Modificado",
    FechaSalida: "2021-11-02",
    Origen: "Origen Test Modificado",
    Destino: "Destino Test Modificado",
    Tipo: "Tipo Test Modificado",
};

let transporteCreado;

// Test de creacion de un transporte
describe('POST /transportes/crear', () => {

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
        const response = await request(app).post('/transportes/crear').set("Cookie", `user=${token}`).send(transporteAlta);
        transporteCreado = response.body;
        expect(response.statusCode).toBe(200);
    });

    test('Debería responder con un objeto de transporte', async () => {
        expect(transporteCreado).toEqual(
            expect.objectContaining({
                ID: expect.any(Number),
                ID_Planificacion: expect.any(Number),
                Nombre: expect.any(String),
                FechaSalida: expect.any(String),
                Origen: expect.any(String),
                Destino: expect.any(String),
                Tipo: expect.any(String),
            }),
        );
    });

    test('Debería responder con un código 400 si falta algún campo', async () => {
        const response = await request(app).post('/transportes/crear').set("Cookie", `user=${token}`).send({
            ID_Planificacion: 1,
            Nombre: "Transporte Test",
            FechaSalida: "2021-11-01",
            Origen: "",
        });
        expect(response.statusCode).toBe(400);
    });
});

// Test de obtencion de transportes
describe('GET /transportes/obtenerTodos/:id', () => {

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
        const response = await request(app).get('/transportes/obtenerTodos/1').set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(200);
    });

    test('Debería responder con un arreglo de transportes', async () => {
        const response = await request(app).get('/transportes/obtenerTodos/1').set("Cookie", `user=${token}`).send();
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    ID: expect.any(Number),
                    ID_Planificacion: expect.any(Number),
                    Nombre: expect.any(String),
                    FechaSalida: expect.any(String),
                    Origen: expect.any(String),
                    Destino: expect.any(String),
                    Tipo: expect.any(String),
                }),
            ]),
        );
    });

    test('Debería responder con un codigo 404 si no hay transportes', async () => {
        const response = await request(app).get('/transportes/obtenerTodos/999').set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(404);
    });
});

// Test de obtencion de un transporte por ID
describe('GET /transportes/obtenerById/:id', () => {

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
        const response = await request(app).get(`/transportes/obtenerById/${transporteCreado.ID}`).set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(200);
    });

    test('Debería responder con un objeto de planificacion', async () => {
        const response = await request(app).get(`/transportes/obtenerById/${transporteCreado.ID}`).set("Cookie", `user=${token}`).send();
        expect(response.body).toEqual(
            expect.objectContaining({
                ID: expect.any(Number),
                ID_Planificacion: expect.any(Number),
                Nombre: expect.any(String),
                FechaSalida: expect.any(String),
                Origen: expect.any(String),
                Destino: expect.any(String),
                Tipo: expect.any(String),
            }),
        );
    });

    test('Debería responder con un código 404 si el transporte no existe', async () => {
        const response = await request(app).get('/transportes/obtenerById/999').set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(404);
    });
});

// Test de modificacion de un transporte
describe('PUT /transportes/modificar/:id', () => {

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
        const response = await request(app).put(`/transportes/modificar/${transporteCreado.ID}`).set("Cookie", `user=${token}`).send(transporteModificacion);
        expect(response.statusCode).toBe(200);
    });

    test('Debería responder con un objeto de planificacion', async () => {
        const response = await request(app).put(`/transportes/modificar/${transporteCreado.ID}`).set("Cookie", `user=${token}`).send(transporteModificacion);
        expect(response.body).toEqual(
            expect.objectContaining({
                Nombre: expect.any(String),
                FechaSalida: expect.any(String),
                Origen: expect.any(String),
                Destino: expect.any(String),
                Tipo: expect.any(String),
            }),
        );
    });

    test('Debería responder con un código 404 si el transporte no existe', async () => {
        const response = await request(app).put('/transportes/modificar/999').set("Cookie", `user=${token}`).send(transporteModificacion);
        expect(response.statusCode).toBe(404);
    });
});

// Test de eliminacion de una transporte
describe(`DELETE /transportes/eliminar/:id`, () => {

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
        const response = await request(app).delete(`/transportes/eliminar/${transporteCreado.ID}`).set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                message: 'Transporte eliminado',
            }),
        );
    });

    test('Debería responder con un código 404 si el transporte no existe', async () => {
        const response = await request(app).delete('/transportes/eliminar/999').set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(404);
    });
});