const mongoose = require('mongoose');
require('dotenv').config();
console.log(process.env.MONGO_URI);
const connect = mongoose.createConnection(
    process.env.MONGO_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }

);

connect.on("connected", function () {
    console.log(`MongoDB::: connected::: ${this.name}`);
    console.log(`MongoDB::: connected::: ${process.env.MONGO_URI}`);

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