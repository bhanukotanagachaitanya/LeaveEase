const { errorResponse } = require('../utils/responseHandler');

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role && req.user.role.toLowerCase() === 'admin') {
    next();
  } else {
    return errorResponse(res, 403, 'Forbidden: Administrator privileges required to access this resource');
  }
};

module.exports = { adminOnly };
