const _typeRoomRepository = require ('./typeRoom.repository');
const dbContext = require('../../database/dbContext');

module.exports = function(router) {
    const typeRoomRepository = _typeRoomRepository(dbContext);
    router.route('/typeroom')
        .get(typeRoomRepository.get);
}
