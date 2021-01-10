var response = require('../../shared/response');
var TYPES = require('tedious').TYPES;

function TypeRoomRepository(dbContext){
    
    
    function getTypeRoom(req,res,next){

            var parameters =[];        
            let query = "select * from TypeRoom";
            dbContext.getQuery(query, parameters,false,function(error,data){

                return res.json(response(data, error));
            });
        
    }
    return{

        get: getTypeRoom
    }
}

module.exports = TypeRoomRepository;
