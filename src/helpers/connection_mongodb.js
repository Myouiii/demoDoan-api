const mongoose = require('mongoose');
require('dotenv').config();
const connect = mongoose.createConnection(
    process.env.MONGO_URL_LOCAL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }

);

connect.on("connected", function () {
    console.log(`MongoDB::: connected::: ${this.name}`);
    console.log(`MongoDB::: connected::: ${process.env.MONGO_URL_LOCAL}`);

})

connect.on("disconnected", function () {
    console.log(`MongoDB::: disconnected::: ${this.name}`);
})
connect.on("error", function (error) {
    console.log(`MongoDB::: error::: ${JSON.stringify(error)}`);
})
process.on('SIGINT', async () => {
    await connect.close();
    process.exit(0);
})

module.exports = connect;