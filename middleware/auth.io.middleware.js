const ApiError = require('../../Backend/scripts/exceptions/api.error');
const tokenService = require('../../Backend/services/token.service');

module.exports = function (socket, next) {
    try {
        const authorizationQuery = socket.handshake.query.accessToken
        if (!authorizationQuery) {
            return next(ApiError.UnauthorizedError());
        }

        const accessToken = authorizationQuery;
        if (!accessToken) {
            return next(ApiError.UnauthorizedError());
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.UnauthorizedError());
        }

        next();
    } catch (e) {
        return next(ApiError.UnauthorizedError());
    }
};
