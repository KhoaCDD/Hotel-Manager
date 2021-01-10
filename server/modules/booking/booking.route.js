const _bookingRepository = require ('./booking.repository');
const dbContext = require('../../database/dbContext');

module.exports = function(router) {
    const bookingRepository = _bookingRepository(dbContext);
    router.route('/book')
        .get(bookingRepository.getAll)
        .post(bookingRepository.post)
        .put(bookingRepository.put)
        .delete(bookingRepository.delete);
}
