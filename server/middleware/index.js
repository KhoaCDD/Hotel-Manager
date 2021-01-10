const jwt = require('jsonwebtoken');
const {checkServicePermission} =require('./servicePermissons');
/**
 * ****************************************
 * Middleware xác thực truy cập người dùng
 * 1.Kiểm tra người dùng đã xác thực
 * 2.Kiểm tra xem JWT của người dùng có hợp lệ hay không? 
 * 4.Kiểm tra người dùng có được phép truy cập vào link hay không?
 * ****************************************
 */

exports.authFunc =()=>{
    return async (req,res,next) =>{
        try {
            // Nếu /login thì next() luôn
            const path = req._parsedUrl.pathname !== '/api' ? req._parsedUrl.pathname : req.baseUrl;

            if(path !== '/api/login'){
                const token =req.header('Authorization');
                /**
                 * Nếu không có JWT được gửi lên -> người dùng chưa đăng nhập
                 */
                if(!token) throw ['access_denied'];
                try {
                    var verified = await jwt.verify(token, process.env.SECRET_TOKEN);
                } catch (error) { 
                    throw ['access_denied'];
                }
                /**
                 * Kiểm tra xem user này có được gọi tới service này hay không?
                 */
                const currentRole = verified.role;
                
                const checkSP = await checkServicePermission(path, req.method, currentRole);
                if (!checkSP) throw ['service_permission_invalid'];                
            }
            

            next();

        }
        catch (error){
            res.status(400).json({
                success: false,
                message:error
            })
        }
    }
}
exports.auth = this.authFunc();
exports.generateToken=(id,username, role) =>{
    const secretToken = process.env.SECRET_TOKEN;
    return jwt.sign({_id:id,username:username,role: role},secretToken, { expiresIn: '86400s' })
}