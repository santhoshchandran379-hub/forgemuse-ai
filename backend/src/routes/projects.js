const express = require('express')
const { body, validationResult, query } = require('express-validator')
const Project = require('../models/Project')
const { authenticate } = require('../middleware/auth')

const router = express.Router()

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg })
  }
  next()
}

// ────────────────────────────────
// GET /projects
// ────────────────────────────────
router.get('/', authenticate, async (req, res) => {
  try {
    const { sort = '-updatedAt', type, search, limit = 50, page = 1 } = req.query
    const filter = { user: req.user._id }
    if (type) filter.type = type

    let queryObj = Project.find(filter)

    // Text search
    if (search) {
      queryObj = Project.find({
        ...filter,
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { excerpt: { $regex: search, $options: 'i' } },
        ],
      })
    }

    const total = await Project.countDocuments(filter)
    const projects = await queryObj
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('-content') // Exclude heavy content from list view
      .lean()

    res.json({
      success: true,
      projects,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
    })
  } catch (err) {
    console.error('Get projects error:', err)
    res.status(500).json({ success: false, message: 'Failed to fetch projects' })
  }
})

// ────────────────────────────────
// GET /projects/:id
// ────────────────────────────────
router.get('/:id', authenticate, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user._id })
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' })
    res.json({ success: true, project })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch project' })
  }
})

// ────────────────────────────────
// POST /projects
// ────────────────────────────────
router.post('/',
  authenticate,
  [
    body('title').notEmpty().withMessage('Title is required').trim().isLength({ max: 200 }),
    body('type').isIn(['song', 'lyrics', 'story', 'script', 'blog', 'social', 'ad']).withMessage('Invalid project type'),
  ],
  validate,
  async (req, res) => {
    try {
      // Check project limit for free users
      if (req.user.plan === 'free') {
        const count = await Project.countDocuments({ user: req.user._id })
        if (count >= 5) {
          return res.status(403).json({
            success: false,
            message: 'Free plan allows up to 5 saved projects. Upgrade to Pro for unlimited projects.',
            code: 'PROJECT_LIMIT',
          })
        }
      }

      const { title, type, content, excerpt, metadata, tags } = req.body
      const project = await Project.create({
        user: req.user._id,
        title,
        type,
        content: content || '',
        excerpt: excerpt || content?.substring(0, 200) || '',
        metadata: metadata || {},
        tags: tags || [],
      })

      res.status(201).json({ success: true, project })
    } catch (err) {
      console.error('Create project error:', err)
      res.status(500).json({ success: false, message: 'Failed to create project' })
    }
  }
)

// ────────────────────────────────
// PUT /projects/:id
// ────────────────────────────────
router.put('/:id', authenticate,
  [body('title').optional().notEmpty().trim()],
  validate,
  async (req, res) => {
    try {
      const { title, content, excerpt, metadata, tags } = req.body
      const project = await Project.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        { title, content, excerpt, metadata, tags },
        { new: true, runValidators: true }
      )
      if (!project) return res.status(404).json({ success: false, message: 'Project not found' })
      res.json({ success: true, project })
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to update project' })
    }
  }
)

// ────────────────────────────────
// DELETE /projects/:id
// ────────────────────────────────
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' })
    res.json({ success: true, message: 'Project deleted successfully' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete project' })
  }
})

module.exports = router
