const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false, // Don't return password by default
  },
  avatar: {
    type: String,
    default: null,
  },
  plan: {
    type: String,
    enum: ['free', 'pro'],
    default: 'free',
  },
  aiUsage: {
    used: { type: Number, default: 0 },
    limit: { type: Number, default: 10 },
    resetDate: { type: Date, default: () => new Date(new Date().setDate(new Date().getDate() + 30)) },
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerified: {
    type: Boolean,
    default: false,
  },
  language: {
    type: String,
    default: 'en',
  },
  notifications: {
    email: { type: Boolean, default: true },
    product: { type: Boolean, default: true },
    weekly: { type: Boolean, default: false },
  },
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password
      delete ret.resetPasswordToken
      delete ret.resetPasswordExpire
      return ret
    },
  },
})

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Reset monthly usage if needed
userSchema.methods.resetUsageIfNeeded = async function () {
  if (this.aiUsage.resetDate && new Date() > this.aiUsage.resetDate) {
    this.aiUsage.used = 0
    this.aiUsage.resetDate = new Date(new Date().setDate(new Date().getDate() + 30))
    await this.save()
  }
}

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Check if user can use AI (within limits)
userSchema.methods.canUseAI = function () {
  if (this.plan === 'pro') return true
  return this.aiUsage.used < this.aiUsage.limit
}

// Increment AI usage
userSchema.methods.incrementUsage = async function () {
  this.aiUsage.used += 1
  await this.save()
}

// Generate password reset token
userSchema.methods.generateResetToken = function () {
  const token = crypto.randomBytes(32).toString('hex')
  this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex')
  this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  return token
}

module.exports = mongoose.model('User', userSchema)
