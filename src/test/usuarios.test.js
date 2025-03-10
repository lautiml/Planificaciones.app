import request from 'supertest';
import app from '../index.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const usuarioAlta = {
    Nombre: "Usuario Test 2",
    Email: "usuario.test2@gmail.com",
    Password: "usuarioTest123"
};

const usuarioModificacion = {
    Nombre: "Usuario Test 2 Modificado",
    Email: "usuario.test2@gmail.com",
    Password: "usuarioTest123"
};

let usuarioCreado;

// Test de creacion de un usuario
describe('POST /usuarios/crear', () => {
    test('Debería responder con un código 200', async () => {
        const response = await request(app).post('/usuarios/crear').send(usuarioAlta);
        usuarioCreado = response.body;
        expect(response.statusCode).toBe(200);
    });

    test('Debería responder con un objeto de usuario', async () => {
        expect(usuarioCreado).toEqual(
            expect.objectContaining({
                Id: expect.any(Number),
                Nombre: expect.any(String),
                Email: expect.any(String),
                Password: expect.any(String),
                FechaRegistro: expect.any(String),
            }),
        );
    });

    test('Debería responder con un código 400 si falta algún campo', async () => {
        const response = await request(app).post('/usuarios/crear').send({
            Nombre: 'Usuario Test',
            Email: ""
        });
        expect(response.statusCode).toBe(400);
    });

    test('Debería responder con un código 409 si el usuario ya existe', async () => {
        const response = await request(app).post('/usuarios/crear').send(usuarioAlta);
        expect(response.statusCode).toBe(409);
    });
});

// Test de obtencion de usuarios
describe('GET /usuarios/obtenerTodos', () => {
    test('Debería responder con un código 200', async () => {
        const response = await request(app).get('/usuarios/obtenerTodos').send();
        expect(response.statusCode).toBe(200);
    });

    test('Debería responder con un arreglo de usuarios', async () => {
        const response = await request(app).get('/usuarios/obtenerTodos').send();
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    Id: expect.any(Number),
                    Nombre: expect.any(String),
                    Email: expect.any(String),
                    Password: expect.any(String),
                    FechaRegistro: expect.any(String),
                }),
            ]),
        );
    });

    /* Siempre da error ya que se deberian borrar todos los usuarios creados.
    test('Debería responder con un codigo 404 si no hay usuarios', async () => {
        const response = await request(app).get('/usuarios/obtenerTodos').send();
        expect(response.statusCode).toBe(404);
    });
    */
});

// Test de obtencion de un usuario por ID
describe('GET /usuarios/obtenerById/:id', () => {
    test('Debería responder con un código 200', async () => {
        const response = await request(app).get('/usuarios/obtenerById/1').send();
        expect(response.statusCode).toBe(200);
    });

    test('Debería responder con un objeto de usuario', async () => {
        const response = await request(app).get('/usuarios/obtenerById/1').send();
        expect(response.body).toEqual(
            expect.objectContaining({
                Id: expect.any(Number),
                Nombre: expect.any(String),
                Email: expect.any(String),
                Password: expect.any(String),
                FechaRegistro: expect.any(String),
            }),
        );
    });

    test('Debería responder con un código 404 si el usuario no existe', async () => {
        const response = await request(app).get('/usuarios/obtenerById/999').send();
        expect(response.statusCode).toBe(404);
    });
});

// Test de modificacion de un usuario
describe('PUT /usuarios/modificar/:id', () => {

    let token;

    beforeAll(() => {
        // Generar un token de prueba para autenticación
        token = jwt.sign({
            Id: usuarioCreado.Id,
            Nombre: 'Usuario Test',
            Email: 'usuario.test@gmail.com'
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION
        });
    });

    test('Debería responder con un código 200', async () => {
        const response = await request(app).put(`/usuarios/modificar/${usuarioCreado.Id}`).set("Cookie", `user=${token}`).send(usuarioModificacion);
        expect(response.statusCode).toBe(200);
    });

    test('Debería responder con un objeto de usuario', async () => {
        const response = await request(app).put(`/usuarios/modificar/${usuarioCreado.Id}`).set("Cookie", `user=${token}`).send(usuarioModificacion);
        expect(response.body).toEqual(
            expect.objectContaining({
                Nombre: usuarioModificacion.Nombre,
                Email: usuarioModificacion.Email,
                Password: usuarioModificacion.Password,
            }),
        );
    });

    test('Debería responder con un código 404 si el usuario no existe', async () => {
        const response = await request(app).put('/usuarios/modificar/999').set("Cookie", `user=${token}`).send(usuarioModificacion);
        expect(response.statusCode).toBe(404);
    });
});

// Test de eliminacion de un usuario
describe(`DELETE /usuarios/eliminar/:id`, () => {

    let token;

    beforeAll(() => {
        // Generar un token de prueba para autenticación
        token = jwt.sign({
            Id: usuarioCreado.Id,
            Nombre: 'Usuario Test',
            Email: 'usuario.test@gmail.com'
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION
        });
    });

    test('Debería responder con un código 200', async () => {
        const response = await request(app).delete(`/usuarios/eliminar/${usuarioCreado.Id}`).set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                message: 'Usuario eliminado',
            }),
        );
    });

    test('Debería responder con un código 404 si el usuario no existe', async () => {
        const response = await request(app).delete('/usuarios/eliminar/999').set("Cookie", `user=${token}`).send();
        expect(response.statusCode).toBe(404);
    });
});