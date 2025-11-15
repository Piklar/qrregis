const Admin = require('../models/Admin');
const CryptoJS = require('crypto-js');
const { errorResponse } = require('../utils/responses');

exports.register = async (req, res) => {
  try {
    const { adminId, username, password } = req.body;
    
    if (!adminId || !username || !password) {
      return errorResponse(res, 400, 'All fields (adminId, username, password) are required');
    }
    
    if (password.length < 8) {
      return errorResponse(res, 400, 'Password must be at least 8 characters');
    }
    
    const existingAdmin = await Admin.findOne({ $or: [{ adminId }, { username }] });
    if (existingAdmin) {
      return errorResponse(res, 409, 'Admin ID or username already exists');
    }
    
    const newAdmin = new Admin({ adminId, username, password });
    await newAdmin.save();
    
    res.json({
      success: true,
      message: 'Admin created successfully',
      admin: {
        adminId: newAdmin.adminId,
        username: newAdmin.username,
        createdAt: newAdmin.createdAt
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return errorResponse(res, 400, 'Validation error', error.errors);
    }
    console.error('Admin registration error:', error);
    errorResponse(res, 500, 'Internal server error');
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return errorResponse(res, 400, 'Username and password are required');
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    const decryptedPassword = CryptoJS.AES.decrypt(admin.password, process.env.ADMIN_SECRET).toString(CryptoJS.enc.Utf8);
    if (decryptedPassword !== password) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    const token = CryptoJS.AES.encrypt(JSON.stringify({
      id: admin._id,
      username: admin.username
    }), process.env.ADMIN_SECRET).toString();

    res.json({
      success: true,
      token,
      admin: {
        username: admin.username,
        adminId: admin.adminId
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    errorResponse(res, 500, 'Internal server error');
  }
};