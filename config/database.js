// Connection string looks like: mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot

module.exports = {
    'url' : process.env.MONGODB_URL || 'mongodb://localhost:27017/theofficekeg'
};