import request from 'supertest';
import app from '../index.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const servicioAlta = {
    ID_Planificacion: 1,
    Nombre: "Transporte Test",
    Descripcion: "Descripcion Test",
    Precio: 1000,
};

const servicioModificacion = {
    Nombre: "Transporte Test Modificado",
    Descripcion: "Descripcion Test Modificada",
    Precio: 2000,
};

let servicioCreado;

// Test de creacion de un servicio
describe('POST /servicios/crear', () => {

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
        const response = await request(app).post('/servicios/crear').set("Cookie", `user=${token}`).send(servicioAlta);
        servicioCreado = response.body;
        expect(response.statusCode).toBe(200);
    });

    test('Debería responder con un objeto de servicio', async () => {
        expect(servicioCreado).toEqual(
            expect.objectContaining({
                ID: expect.any(Number),
                ID_Planificacion: expect.any(Number),
                Nombre: expect.any(String),
                Descripcion: expect.any(String),
                Precio: expect.any(Number),
                FechaRegistro: expect.any(String),
            }),
        );
    });

    test('Debería responder con un código 400 si falta algún campo', async () => {
        const response = await request(app).post('/servicios/crear').set("Cookie", `user=${token}`).send({
            ID_Planificacion: 1,
        });
        expect(response.statusCode).toBe(400);
    });
});

// Test de obtencion de servicios
describe('GET /servicios/obtenerTodos/:id', () => {

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
        const response = await request(app).get('/servicios/obtenerTodos/1').set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(200);
    });

    test('Debería responder con un arreglo de servicios', async () => {
        const response = await request(app).get('/servicios/obtenerTodos/1').set("Cookie", `user=${token}`).send();
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    ID: expect.any(Number),
                    ID_Planificacion: expect.any(Number),
                    Nombre: expect.any(String),
                    Descripcion: expect.any(String),
                    Precio: expect.any(Number),
                    FechaRegistro: expect.any(String),
                }),
            ]),
        );
    });

    test('Debería responder con un codigo 404 si no hay servicios', async () => {
        const response = await request(app).get('/servicios/obtenerTodos/999').set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(404);
    });
});

// Test de obtencion de un servicio por ID
describe('GET /servicios/obtenerById/:id', () => {

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
        const response = await request(app).get(`/servicios/obtenerById/${servicioCreado.ID}`).set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(200);
    });

    test('Debería responder con un objeto de servicio', async () => {
        const response = await request(app).get(`/servicios/obtenerById/${servicioCreado.ID}`).set("Cookie", `user=${token}`).send();
        expect(response.body).toEqual(
            expect.objectContaining({
                ID: expect.any(Number),
                ID_Planificacion: expect.any(Number),
                Nombre: expect.any(String),
                Descripcion: expect.any(String),
                Precio: expect.any(Number),
                FechaRegistro: expect.any(String),
            }),
        );
    });

    test('Debería responder con un código 404 si el servicio no existe', async () => {
        const response = await request(app).get('/servicios/obtenerById/999').set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(404);
    });
});

// Test de modificacion de un servicio
describe('PUT /servicios/modificar/:id', () => {

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
        const response = await request(app).put(`/servicios/modificar/${servicioCreado.ID}`).set("Cookie", `user=${token}`).send(servicioModificacion);
        expect(response.statusCode).toBe(200);
    });

    test('Debería responder con un objeto de servicio', async () => {
        const response = await request(app).put(`/servicios/modificar/${servicioCreado.ID}`).set("Cookie", `user=${token}`).send(servicioModificacion);
        expect(response.body).toEqual(
            expect.objectContaining({
                Nombre: expect.any(String),
                Descripcion: expect.any(String),
                Precio: expect.any(Number),
            }),
        );
    });

    test('Debería responder con un código 404 si el servicio no existe', async () => {
        const response = await request(app).put('/servicios/modificar/999').set("Cookie", `user=${token}`).send(servicioModificacion);
        expect(response.statusCode).toBe(404);
    });
});

// Test de eliminacion de un servicio
describe(`DELETE /servicios/eliminar/:id`, () => {

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
        const response = await request(app).delete(`/servicios/eliminar/${servicioCreado.ID}`).set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                message: 'Servicio eliminado',
            }),
        );
    });

    test('Debería responder con un código 404 si el servicio no existe', async () => {
        const response = await request(app).delete('/servicios/eliminar/999').set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(404);
    });
});