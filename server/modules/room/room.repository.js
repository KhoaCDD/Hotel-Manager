var response = require('../../shared/response');
var TYPES = require('tedious').TYPES;

function RoomRepository(dbContext){
    
    function getRoomList(req,res,next){
        if((req.query.type) &&(req.query.size)&&(req.query.from)&&(req.query.to)&&(req.query.page)) {
           
            var parameters =[];
            let query;
            if(req.query.type=="-1"){

                parameters.push({name : 'from', type:TYPES.DateTime, val: req.query.from });
                parameters.push({name : 'to', type:TYPES.DateTime, val: req.query.to });
                query = "SELECT * FROM Room, TypeRoom WHERE Room.id_room not in"
                        +"(SELECT BookRoom.id_room FROM BookRoom where (BookRoom.start > @from AND BookRoom.start < @to ) OR (BookRoom.start < @from AND BookRoom.expire > @from ) OR (BookRoom.start = @from) OR (BookRoom.expire = @to))"
                        +"AND Room.type_room=TypeRoom.id";                          
            }
            else{

                parameters.push({name : 'from', type:TYPES.DateTime, val: req.query.from });
                parameters.push({name : 'to', type:TYPES.DateTime, val: req.query.to });
                parameters.push({name : 'type', type:TYPES.Int, val: req.query.type });

                query = "SELECT * FROM Room, TypeRoom WHERE Room.id_room not in"
                        +"(SELECT BookRoom.id_room FROM BookRoom where (BookRoom.start > @from AND BookRoom.start < @to ) OR (BookRoom.start < @from AND BookRoom.expire > @from ) OR (BookRoom.start = @from) OR (BookRoom.expire = @to))"
                        +" AND Room.type_room = @type "
                        +" AND Room.type_room=TypeRoom.id";                         
            }
            dbContext.getQuery(query, parameters,false,function(error,rawData){
                let data=[];
                data=rawData.filter(data=>data.status_room==="OK"); 
                let page=req.query.page;
                let size=req.query.size;
                console.log('\n\n\n\n\n\n\\n\nn\npage',data.length );
                let totalPage = (data.length % size >= 1)?(data.length/size + 1):(data.length/size);
                //paginating
                let offset=0;
                if(parseInt(page) > 1){
                    offset = parseInt(size)*(parseInt(page)-1);
                };
                data = data.slice(offset,parseInt(offset)+parseInt(size));
                let finalData = {
                    totalPage: totalPage,
                    page: page,
                    roomList: data
                }
                return res.json(response(finalData, error));
            });
        }
    }

    function getList(req,res,next){
           
        var parameters =[];
        let query;
        query = "SELECT * FROM Room, TypeRoom WHERE Room.type_room = id";
                                
    
        dbContext.getQuery(query, parameters,false,function(error,data){
            
            return res.json(response(data, error));
        });
    }

    
    function addRoom(req,res,next){
        var parameters =[];
        parameters.push({name : 'room', type:TYPES.Int, val: req.body.id_room });
        parameters.push({name : 'type', type:TYPES.Int, val: req.body.type });
        parameters.push({name : 'status', type:TYPES.VarChar, val: req.body.status });

        let query;
        query = "insert into Room(id_room,type_room, status_room) VALUES(@room, @type, @status)";
                                  
        dbContext.getQuery(query, parameters,false,function(error,data){
            
            return res.json(response(data, error));
        });
    }

    function deleteRoom(req,res,next){
        var parameters =[];
        parameters.push({name : 'room', type:TYPES.Int, val: req.body.id_room });

        let query;
        query = "delete from Room where id_room = @room";
                                  
        dbContext.getQuery(query, parameters,false,function(error,data){
            
            return res.json(response(data, error));
        });
    }

    return{
        get: getRoomList,
        getRoomList: getList,
        post: addRoom,
        delete: deleteRoom
    }
}

module.exports = RoomRepository;
