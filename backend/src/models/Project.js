const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  type: {
    type: String,
    required: true,
    enum: ['song', 'lyrics', 'story', 'script', 'blog', 'social', 'ad'],
  },
  content: {
    type: String,
    default: '',
  },
  excerpt: {
    type: String,
    maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    default: '',
  },
  tags: [{
    type: String,
    maxlength: 50,
  }],
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
})

// Index for searching
projectSchema.index({ user: 1, updatedAt: -1 })
projectSchema.index({ user: 1, type: 1 })
projectSchema.index({ title: 'text', excerpt: 'text' })

module.exports = mongoose.model('Project', projectSchema)
