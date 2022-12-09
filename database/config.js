const mongoose = require('mongoose');

const dbConnection = async() => {

    try {
        
        await mongoose.connect(process.env.DB_CNN);

        console.log('DB online')

    } catch (error) {
        console.error(error)
        throw new Error('Error en conecion de BD');
    }

}

module.exports = {
    dbConnection
}