const jwt = require('jsonwebtoken')
const User = require('../models/User')

/**
 * Verify JWT and attach user to request
 */
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('+password')
    if (!user) {
      return res.status(401).json({ success: false, message: 'Token invalid. User not found.' })
    }
    req.user = user
    next()
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token' })
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired. Please sign in again.' })
    }
    return res.status(500).json({ success: false, message: 'Authentication error' })
  }
}

/**
 * Check if user has Pro plan
 */
const requirePro = (req, res, next) => {
  if (req.user.plan !== 'pro') {
    return res.status(403).json({
      success: false,
      message: 'This feature requires a Pro plan.',
      code: 'PRO_REQUIRED',
    })
  }
  next()
}

/**
 * Check AI usage limit
 */
const checkAILimit = async (req, res, next) => {
  // Unlimited AI usage
  next()
}

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

module.exports = { authenticate, requirePro, checkAILimit, generateToken }
