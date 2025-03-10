import { DataTypes } from "sequelize";
import sequelize from "../databases/database.js";
import Planificaciones from "./planificaciones.models.js";

const Actividades = sequelize.define("Actividades", {
    ID: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    ID_Planificacion: {
        type: DataTypes.INTEGER,
        notNull: true,
        references: {
            model: Planificaciones,
            key: "ID"
        }
    },
    Nombre: {
        type: DataTypes.TEXT,
        notNull: true,
    },
    FechaPlaneada: {
        type: DataTypes.DATEONLY,
    },
    FechaRegistro: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
    Descripcion: {
        type: DataTypes.TEXT,
    },
    Duracion: {
        type: DataTypes.TIME,
    }
}, {
    timestamps: false
});

Actividades.belongsTo(Planificaciones, {
    foreignKey: "ID_Planificacion",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

Planificaciones.hasMany(Actividades, { foreignKey: "ID_Planificacion" });

export default Actividades;