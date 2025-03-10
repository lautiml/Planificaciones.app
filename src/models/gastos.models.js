import { DataTypes } from "sequelize";
import sequelize from "../databases/database.js";
import Planificaciones from "./planificaciones.models.js";

const Gastos = sequelize.define("Gastos", {
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
    Monto: {
        type: DataTypes.NUMERIC,
        notNull: true,
    },
    FechaRegistro: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    },
    Descripcion: {
        type: DataTypes.TEXT,
    }
}, {
    timestamps: false
});

Gastos.belongsTo(Planificaciones, {
    foreignKey: "ID_Planificacion",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

Planificaciones.hasMany(Gastos, { foreignKey: "ID_Planificacion" });

export default Gastos;