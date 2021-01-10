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

        var query = "select * from account"

        dbContext.getQuery(query, parameters, false, function (error, data) {
            return res.json(response(data, error));
        });
        
    }
    return{
        find: findUser,
        get: getAllUsers
    }
}

module.exports = UserRepository;
