exports.checkServicePermission = async ( path, method, currentRole) => {
    var result = false;
    let role = currentRole;
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (result === false && element.path === path && element.method === method) {
            for (let i = 0; i < element.roles.length; i++) {
                if(role === element.roles[i])
                {
                    result =true;
                    break;
                }                
            }
        }
    }

    return result;
}
const data =
[
    //user
    { path: '/api/login', method: 'POST', roles: [0,1,2] },
    { path: '/api/staff', method: 'GET', roles: [0,1] },
    { path: '/api/staff', method: 'DELETE', roles: [0,1] },
    { path: '/api/staff', method: 'POST', roles: [0,1] },
    
    //room
    { path: '/api/room', method: 'GET', roles: [0,1,2] },
    { path: '/api/roomList', method: 'GET', roles: [0,1] },
    { path: '/api/room', method: 'POST', roles: [0,1] },
    { path: '/api/room', method: 'DELETE', roles: [0,1] },

    //booking
    { path: '/api/book', method: 'GET', roles: [0,1,2] },
    { path: '/api/book', method: 'POST', roles: [0,1,2] },
    { path: '/api/book', method: 'PUT', roles: [0,1,2] },
    { path: '/api/book', method: 'DELETE', roles: [0,1,2] },

    //type room
    { path: '/api/typeroom', method: 'GET', roles: [0,1,2] },

]