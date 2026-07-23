const express = require('express')
const { body, validationResult } = require('express-validator')
const crypto = require('crypto')
const User = require('../models/User')
const { authenticate, generateToken } = require('../middleware/auth')
const nodemailer = require('nodemailer')

const router = express.Router()

// Validation helpers
const emailValidator = body('email').isEmail().withMessage('Invalid email').normalizeEmail()
const passwordValidator = body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg, errors: errors.array() })
  }
  next()
}

// ────────────────────────────────
// POST /auth/register
// ────────────────────────────────
router.post('/register',
  [body('name').notEmpty().withMessage('Name is required').trim(), emailValidator, passwordValidator],
  validate,
  async (req, res) => {
    try {
      const { name, email, password } = req.body

      const existing = await User.findOne({ email })
      if (existing) {
        return res.status(409).json({ success: false, message: 'An account with this email already exists.' })
      }

      const user = await User.create({ name, email, password })
      const token = generateToken(user._id)

      res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          aiUsage: user.aiUsage,
          createdAt: user.createdAt,
        },
      })
    } catch (err) {
      console.error('Register error:', err)
      res.status(500).json({ success: false, message: 'Registration failed. Please try again.' })
    }
  }
)

// ────────────────────────────────
// POST /auth/login
// ────────────────────────────────
router.post('/login',
  [emailValidator, body('password').notEmpty().withMessage('Password is required')],
  validate,
  async (req, res) => {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ email }).select('+password')

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' })
      }

      const token = generateToken(user._id)

      res.json({
        success: true,
        message: 'Logged in successfully.',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          aiUsage: user.aiUsage,
          createdAt: user.createdAt,
        },
      })
    } catch (err) {
      console.error('Login error:', err)
      res.status(500).json({ success: false, message: 'Login failed. Please try again.' })
    }
  }
)

// ────────────────────────────────
// GET /auth/me
// ────────────────────────────────
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    res.json({ success: true, user })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch user' })
  }
})

// ────────────────────────────────
// PUT /auth/profile
// ────────────────────────────────
router.put('/profile', authenticate,
  [body('name').notEmpty().trim()],
  validate,
  async (req, res) => {
    try {
      const { name, language, notifications } = req.body
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { name, language, notifications },
        { new: true, runValidators: true }
      )
      res.json({ success: true, user })
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to update profile' })
    }
  }
)

// ────────────────────────────────
// PUT /auth/password
// ────────────────────────────────
router.put('/password', authenticate,
  [body('newPassword').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')],
  validate,
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body
      const user = await User.findById(req.user._id).select('+password')

      if (!(await user.comparePassword(currentPassword))) {
        return res.status(401).json({ success: false, message: 'Current password is incorrect.' })
      }

      user.password = newPassword
      await user.save()

      res.json({ success: true, message: 'Password changed successfully.' })
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to change password' })
    }
  }
)

// ────────────────────────────────
// POST /auth/forgot-password
// ────────────────────────────────
router.post('/forgot-password', emailValidator, validate, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    // Always return 200 to prevent email enumeration
    if (!user) return res.json({ success: true, message: 'If an account exists, a reset link has been sent.' })

    const resetToken = user.generateResetToken()
    await user.save()

    const resetURL = `${process.env.FRONTEND_URL}/auth/reset-password/${resetToken}`

    // Send email
    try {
      const transporter = nodemailer.createTransporter({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false,
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      })

      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'ForgeMuse AI <noreply@forgemuseai.com>',
        to: user.email,
        subject: 'Reset your ForgeMuse AI password',
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
            <h1 style="color: #1e293b; margin-bottom: 8px;">Reset your password</h1>
            <p style="color: #64748b; margin-bottom: 24px;">Click the button below to reset your ForgeMuse AI password. This link expires in 10 minutes.</p>
            <a href="${resetURL}" style="display: inline-block; padding: 12px 24px; background: #3b62f5; color: white; font-weight: 600; border-radius: 12px; text-decoration: none; margin-bottom: 24px;">Reset Password</a>
            <p style="color: #94a3b8; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
            <p style="color: #94a3b8; font-size: 12px;">— ForgeMuse AI Team</p>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error('Email error:', emailErr)
    }

    res.json({ success: true, message: 'If an account exists, a reset link has been sent.' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to process reset request' })
  }
})

// ────────────────────────────────
// POST /auth/reset-password/:token
// ────────────────────────────────
router.post('/reset-password/:token',
  [passwordValidator],
  validate,
  async (req, res) => {
    try {
      const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
      })

      if (!user) {
        return res.status(400).json({ success: false, message: 'Reset link is invalid or has expired.' })
      }

      user.password = req.body.password
      user.resetPasswordToken = undefined
      user.resetPasswordExpire = undefined
      await user.save()

      const token = generateToken(user._id)
      res.json({ success: true, message: 'Password reset successfully.', token })
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to reset password' })
    }
  }
)

// ────────────────────────────────
// DELETE /auth/account
// ────────────────────────────────
router.delete('/account', authenticate, async (req, res) => {
  try {
    const Project = require('../models/Project')
    await Project.deleteMany({ user: req.user._id })
    await User.findByIdAndDelete(req.user._id)
    res.json({ success: true, message: 'Account deleted successfully.' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete account' })
  }
})

module.exports = router
