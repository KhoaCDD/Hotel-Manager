var response = require('../../shared/response');
var TYPES = require('tedious').TYPES;

function BookingRepository(dbContext){
    
    function getBookList(req,res,next){
        if((req.query.size) &&(req.query.page)) {
           
            var parameters =[];
            let size = parseInt(req.query.size);
            let page =parseInt(req.query.page)-1;
            let offset= parseInt(page*size);

            parameters.push({name : 'size', type:TYPES.Int, val: req.query.size });
            parameters.push({name : 'offset', type:TYPES.Int, val: offset });
            
            let date = new Date(),
                d=date.getDate(),
                m=1+ parseInt(date.getMonth()),
                year =date.getFullYear();
            let currentTime = year + '-'+m+'-'+d;
            currentTime = '2020-1-1';
            parameters.push({name : 'time', type:TYPES.DateTime, val: currentTime });
            let query = "SELECT * FROM Customer, Bookroom, Account " +
            "WHERE Customer.id_admin=Account.id " +
            "AND Customer.id_customer=Bookroom.id_customer " +
            "AND BookRoom.expire > @time " +
            "ORDER BY Customer.id_customer OFFSET @offset ROWS FETCH NEXT @size ROWS ONLY";
            //TODO : order by date
            dbContext.getQuery(query, parameters,false,function(error,data){
                return res.json(response(data, error));
            });
        }
    }

    function bookRoom(req,res,next){
        if((req.body)) {

            let cusName = req.body.name_customer;
            let age =req.body.age;
            let admin = req.body.id_admin;
            let noid = req.body.noid;
            let phone = req.body.phone;
            let note = req.body.note;
            let booking = req.body.booking;
            var parameters =[];
            let tailQuery = "";
            parameters.push({name : 'cusName', type:TYPES.VarChar, val: cusName });
            parameters.push({name : 'age', type:TYPES.Int, val: age });
            parameters.push({name : 'admin', type:TYPES.Int, val: admin });
            parameters.push({name : 'noid', type:TYPES.VarChar, val: noid });
            parameters.push({name : 'note', type:TYPES.VarChar, val: note });
            parameters.push({name : 'phone', type:TYPES.VarChar, val: phone });
            for(let i= 0;i<booking.length;i++){
                parameters.push({name : ('id_room'+i), type:TYPES.Int, val: booking[i].id_room });
                parameters.push({name : ('start'+i), type:TYPES.DateTime, val: booking[i].start });
                parameters.push({name : ('end'+i), type:TYPES.DateTime, val: booking[i].end });
                tailQuery+=" insert into BookRoom(id_room,id_customer,start,expire) VALUES(@"+('id_room'+i)
                         +",(SELECT TOP 1 id_customer FROM Customer ORDER BY id_customer DESC)"
                         +",@"+('start'+i)
                         +",@"+('end'+i)+')';
            }

            let query = "INSERT INTO Customer"+"(name_customer,age,id_admin,noid,phone,note)"+" VALUES(@cusName,@age,@admin,@noid,@phone,@note)"
                       + tailQuery
            dbContext.getQuery(query, parameters,false,function(error,data){
                res.json(response(data,error));
            });
            
        }        
    }
    function updateBooking(req,res,next){
        let start =new Date(req.body.start),
            end = new Date(req.body.expire),
            newStart = new Date(req.body.newStart),
            newExpire =new Date(req.body.newExpire);
            console.log('\n\n\n\n\n\n\n\n121212',req.body)
        if((newStart >= start)&&(newExpire <= end)){
            var parameters =[];        
            parameters.push({name : 'room', type:TYPES.Int, val: req.body.id_room });
            parameters.push({name : 'start', type:TYPES.DateTime, val: req.body.start });
            parameters.push({name : 'expire', type:TYPES.DateTime, val: req.body.expire });
            parameters.push({name : 'newStart', type:TYPES.DateTime, val: req.body.newStart });
            parameters.push({name : 'newExpire', type:TYPES.DateTime, val: req.body.newExpire });
            let query = "UPDATE BookRoom " +
            "SET start= @newStart, expire= @newExpire " +
            "WHERE id_room= @room AND start= @start AND expire=@expire ";
            dbContext.getQuery(query, parameters,false,function(error,data){
                return res.json(response(data, error));
            });
        }
        else{
            return res.json("warning_conflict");
        }
        
    }
    function deleteBooking(req,res,next){

            var parameters =[];        
            parameters.push({name : 'room', type:TYPES.Int, val: req.body.id_room });
            parameters.push({name : 'start', type:TYPES.DateTime, val: req.body.start });
            parameters.push({name : 'expire', type:TYPES.DateTime, val: req.body.expire });
            let query = "DELETE FROM BookRoom WHERE id_room=@room AND start= @start AND expire= @expire ";
            dbContext.getQuery(query, parameters,false,function(error,data){
                if(data!==false){
                    data = true;
                }
                return res.json(response(data, error));
            });
        
    }
    return{
        getAll: getBookList,
        post: bookRoom,
        put: updateBooking,
        delete: deleteBooking
    }
}

module.exports = BookingRepository;
