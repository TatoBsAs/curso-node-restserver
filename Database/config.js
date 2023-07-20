const mongoose = require('mongoose');

const dbCon = async () => {
    try{

        await mongoose.connect(process.env.MONGO_CON,{
            useNewUrlParser: true,
            useUnifiedTopology: true/*,
            useCreateIndex:true,
            useFindAndModify:false*/
        });

        console.log('Base de datos en linea');


    }catch (error) {
        console.log(error);
        throw new Error ('Error al conectar con base de datos');

    }
}

module.exports = {
    dbCon
}