import { DataTypes } from "sequelize";
import sequelize from "../databases/database.js";

const Usuarios = sequelize.define("Usuarios", {
    Id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    Nombre: {
        type: DataTypes.TEXT,
        notNull: true,
    },
    Email: {
        type: DataTypes.TEXT,
        unique: true,
        notNull: true
    },
    Password: {
        type: DataTypes.TEXT,
        notNull: true
    },
    FechaRegistro: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false
});

export default Usuarios;