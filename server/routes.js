const express = require('express'); 

function eRoutes() {
    const router = express.Router();
    var user = require('./modules/user/user.route')(router);
    console.log(".....in route");
    var typeRoom = require('./modules/type-room/typeRoom.route')(router);
    var room = require('./modules/room/room.route')(router);
    // var customer =require ('./modules/customer/customer.route')(router);
    var booking = require('./modules/booking/booking.route')(router);

    return router;
}

module.exports = eRoutes;