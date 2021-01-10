const _userRepository = require ('./user.repository');
const dbContext = require('../../database/dbContext');

module.exports = function(router) {
    const userRepository = _userRepository(dbContext);
    console.log(".....in route");
    router.route('/login')
        .post(userRepository.find);
    router.get('/staff', userRepository.get);
}
