import { DataTypes } from "sequelize";
import sequelize from "../databases/database.js";
import Planificaciones from "./planificaciones.models.js";

const Hospedajes = sequelize.define("Hospedajes", {
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
    Descripcion: {
        type: DataTypes.TEXT,
    },
    Tipo: {
        type: DataTypes.TEXT,
    },
    Precio: {
        type: DataTypes.NUMERIC,
    },
    FechaInicio: {
        type: DataTypes.DATEONLY,
        validate: {
            isBefore(value) {
                if (value && this.FechaFin && value > this.FechaFin) {
                    throw new Error("Fecha de inicio no puede ser mayor que la fecha de fin");
                }
            }
        }
    },
    FechaFin: {
        type: DataTypes.DATEONLY,
        validate: {
            isAfter(value) {
                if (value && this.FechaInicio && value < this.FechaInicio) {
                    throw new Error("Fecha de fin no puede ser menor que la fecha de inicio");
                }
            }
        }
    }
}, {
    timestamps: false
});

Hospedajes.belongsTo(Planificaciones, {
    foreignKey: "ID_Planificacion",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

Planificaciones.hasMany(Hospedajes, { foreignKey: "ID_Planificacion" });

export default Hospedajes;