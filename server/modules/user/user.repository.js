var response = require('../../shared/response');
var TYPES = require('tedious').TYPES;
var middleware=require('../../middleware/index');

function UserRepository(dbContext){
    
    function findUser(req,res,next){

        if((req.query.username) &&(req.query.password)) {
           
            var parameters =[];
            parameters.push({name : 'username', type:TYPES.VarChar, val: req.query.username });
            parameters.push({name : 'password', type:TYPES.VarChar, val: req.query.password });
            let query = "select username, role,id from account where username = @username and password=@password";
            dbContext.getQuery(query, parameters,false,function(error,data){
                let result;
                if(data ===false){
                    result = 'Error username or password';
                }
                else{
                    result =data[0];
                }
                if(data[0]){
                    let token = middleware.generateToken(result.id,result.username,result.role);
                    result = token+ '#'+result.id+'#'+result.role;
                }
                return res.json(response(result,error));
            });
        }
    }

    function getAllUsers(req, res) {

        var parameters = [];
        if(req.query.role > 0)
        var query = "select Users.id, fullname, dob,address, phone, role from  Users, Account where Users.id=Account.id and account.role > 1 order by role asc"
        else {
            query = "select Users.id, fullname, dob,address, phone, role from  Users, Account where Users.id=Account.id order by role asc"
        }
        dbContext.getQuery(query, parameters, false, function (error, data) {
            return res.json(response(data, error));
        });
        
    }
    function deleteUser(req,res,next){

        var parameters =[];        
        parameters.push({name : 'id', type:TYPES.Int, val: req.body.id });
        let query = "DELETE FROM Account WHERE id=@id; DELETE FROM Users WHERE id=@id";
        dbContext.getQuery(query, parameters,false,function(error,data){
            if(data!==false){
                console.log("\n\n\n\n\n\n",data)
                data = true;
            }
            return res.json(response(data, error));
        });    
    }
    function addUser(req,res,next){
        var parameters =[];
        console.log("bodyyy\n",req.body)
        parameters.push({name : 'username', type:TYPES.VarChar, val: req.body.username });
        parameters.push({name : 'password', type:TYPES.VarChar, val: req.body.password });
        parameters.push({name : 'role', type:TYPES.Int, val: req.body.role });
        parameters.push({name : 'fullname', type:TYPES.VarChar, val: req.body.fullname });
        parameters.push({name : 'dob', type:TYPES.DateTime, val: req.body.dob });
        parameters.push({name : 'address', type:TYPES.VarChar, val: req.body.address });
        parameters.push({name : 'phone', type:TYPES.VarChar, val: req.body.phone });

        let query;
        query = "insert into account(username,password, role) VALUES(@username, @password, @role)"
                +"insert into Users(id,fullname,dob,address,phone) VALUES((select top 1 id from account order by id desc), @fullname, @dob,@address,@phone)";
                //(select top 1 id from account order by id desc)
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
        find: findUser,
        get: getAllUsers,
        delete: deleteUser,
        post:addUser
    }
}

module.exports = UserRepository;
