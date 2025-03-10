import { Sequelize } from 'sequelize';

const sequelize = new Sequelize("db","","",{
    dialect: "sqlite",
    storage: "./src/databases/database.sqlite"
})

export default sequelize;