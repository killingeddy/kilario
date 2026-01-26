const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const adminRepository = require("../repositories/admin.repository");
const { AppError } = require("../middlewares/errorHandler");
const logger = require("../utils/logger");

const SALT_ROUNDS = 12;

const authService = {
  async login(email, password) {
    const admin = await adminRepository.findByEmail(email);

    if (!admin) {
      logger.warn("Login attempt with invalid email", { email });
      throw new AppError("Invalid credentials", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      logger.warn("Login attempt with invalid password", { email });
      throw new AppError("Invalid credentials", 401);
    }

    await adminRepository.updateLastLogin(admin.id);
    const token = this.generateToken(admin);

    logger.audit("ADMIN_LOGIN", admin.id, { email: admin.email });

    return {
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    };
  },

  async register(name, email, password) {
    const existingAdmin = await adminRepository.findByEmail(email);

    if (existingAdmin) {
      throw new AppError("Email already registered", 409);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const admin = await adminRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    logger.audit("ADMIN_REGISTERED", admin.id, { email: admin.email });

    const token = this.generateToken(admin);

    return {
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
    };
  },

  async changePassword(adminId, currentPassword, newPassword) {
    const admin = await adminRepository.findByEmail(
      (await adminRepository.findById(adminId)).email,
    );

    if (!admin) {
      throw new AppError("Admin not found", 404);
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      admin.password,
    );

    if (!isPasswordValid) {
      throw new AppError("Current password is incorrect", 401);
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await adminRepository.updatePassword(adminId, hashedPassword);

    logger.audit("PASSWORD_CHANGED", adminId);

    return { message: "Password changed successfully" };
  },

  async getProfile(adminId) {
    const admin = await adminRepository.findById(adminId);

    if (!admin) {
      throw new AppError("Admin not found", 404);
    }

    return admin;
  },

  generateToken(admin) {
    return jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
    );
  },

  verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  },
};

module.exports = authService;
