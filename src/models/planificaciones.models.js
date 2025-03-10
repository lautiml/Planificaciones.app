import { BelongsTo, DataTypes } from "sequelize";
import sequelize from "../databases/database.js";
import Usuarios from "./usuarios.models.js";

const Planificaciones = sequelize.define("Planificaciones", {
    ID: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    ID_Usuario: {
        type: DataTypes.INTEGER,
        notNull: true,
        references: {
            model: Usuarios,
            key: "ID"
        }
    },
    Nombre: {
        type: DataTypes.TEXT,
        notNull: true,
        defaultValue: "Sin nombre"
    },
    FechaRegistro: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
    FechaInicio: {
        type: DataTypes.DATEONLY,
        notNull: true
    },
    FechaFin: {
        type: DataTypes.DATEONLY,
        notNull: true
    },
    Descripcion: {
        type: DataTypes.TEXT,
    }
}, {
    timestamps: false
});

Planificaciones.belongsTo(Usuarios, {
    foreignKey: "ID_Usuario",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

Usuarios.hasMany(Planificaciones, { foreignKey: "ID_Usuario" });

export default Planificaciones;