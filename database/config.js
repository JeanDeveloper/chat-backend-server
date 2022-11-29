const mongoose = require('mongoose')

const dbConnection = async() => {

    try {

        mongoose.connect(process.env.DB_CNN, {
            
        });

        console.log('BD CONNECT')
        
    } catch (error) {
        console.log(error);
        throw new Error("Error en la base de datos - hable con el admin")
    }

};

module.exports = {
    dbConnection
}