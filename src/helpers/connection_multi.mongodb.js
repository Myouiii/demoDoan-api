const mongoose = require('mongoose');

require('dotenv').config();
function newConnection(uri) {
    const connect = mongoose.createConnection(
        uri,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    );
    connect.on("connected", function () {
        console.log(`MongoDB::: connected::: ${this.name}`);
    })
    connect.on("disconnected", function () {
        console.log(`MongoDB::: disconnected::: ${this.name}`);
    })
    connect.on("error", function (error) {
        console.log(`MongoDB::: error::: ${JSON.stringify(error)}`);
    })
    return connect;
}


const testConnection = newConnection(process.env.URI_MONGODB_TEST);
const UserConnection = newConnection(process.env.URI_MONGODB_USERS);


module.exports = {
    testConnection,
    UserConnection
}
