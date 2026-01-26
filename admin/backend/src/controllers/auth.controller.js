const authService = require('../services/auth.service');
const responses = require('../utils/responses');
const { asyncHandler } = require('../middlewares/errorHandler');

const authController = {
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    const result = await authService.login(email, password);
    
    return responses.success(res, result, 'Login successful');
  }),

  register: asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    
    const result = await authService.register(name, email, password);
    
    return responses.created(res, result, 'Admin registered successfully');
  }),

  me: asyncHandler(async (req, res) => {
    const admin = await authService.getProfile(req.admin.id);
    
    return responses.success(res, { admin });
  }),

  changePassword: asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    const result = await authService.changePassword(
      req.admin.id,
      currentPassword,
      newPassword
    );
    
    return responses.success(res, result);
  }),
};

module.exports = authController;
