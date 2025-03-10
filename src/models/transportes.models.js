import { DataTypes } from "sequelize";
import sequelize from "../databases/database.js";
import Planificaciones from "./planificaciones.models.js";

const Transportes = sequelize.define("Transportes", {
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
    FechaSalida: {
        type: DataTypes.DATEONLY,
        notNull: true
    },
    Origen: {
        type: DataTypes.TEXT,
        notNull: true
    },
    Destino: {
        type: DataTypes.TEXT,
        notNull: true
    },
    Tipo: {
        type: DataTypes.TEXT,
        notNull: true
    },
}, {
    timestamps: false
});

Transportes.belongsTo(Planificaciones, {
    foreignKey: "ID_Planificacion",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
});

Planificaciones.hasMany(Transportes, { foreignKey: "ID_Planificacion" });

export default Transportes;