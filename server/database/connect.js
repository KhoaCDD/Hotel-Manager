var Connection = require('tedious').Connection;

var server= process.env.DB_SERVER;
var username=process.env.DB_USERNAME;
var password=process.env.DB_PASSWORD;
var instance=process.env.DB_INSTANCE;
var dbPort =process.env.DB_PORT;
var dbName = process.env.DATABASE;

var config = {
    server: 'DESKTOP-0OCMN9U',
    authentication: {
        type: 'default',
        options: {
            userName: 'sa',
            password: '123456'
        }
    },
    port: dbPort,
    options: {

        database: 'WebProject',
        instanceName: 'MSSQLSERVER',
        rowCollectionOnDone: true,
        useColumnNames: false
    }
}

var connection = new Connection(config);

connection.on('connect', function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Database Successfully Connected !!!');
    }
});

module.exports = connection;
