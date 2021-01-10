const _roomRepository = require ('./room.repository');
const dbContext = require('../../database/dbContext');

module.exports = function(router) {
    const roomRepository = _roomRepository(dbContext);
    router.route('/room')
        .get(roomRepository.get)
        .post(roomRepository.post)
        .delete(roomRepository.delete);
    router.route('/roomlist')
        .get(roomRepository.getRoomList);
}
