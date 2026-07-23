const express = require('express')
const { authenticate, checkAILimit } = require('../middleware/auth')
const {
  generateSong, improveLyrics, generateStory, generateScript,
  generateBlog, generateSocial, generateAd, chat
} = require('../services/aiService')

const router = express.Router()

// All AI routes require auth + usage limit check
router.use(authenticate, checkAILimit)

// ─────────────────────────────
// POST /ai/song
// ─────────────────────────────
router.post('/song', async (req, res) => {
  try {
    const result = await generateSong(req.body)
    await req.user.incrementUsage()
    res.json({ success: true, result, aiUsage: req.user.aiUsage })
  } catch (err) {
    console.error('Song generation error:', err)
    res.status(500).json({ success: false, message: 'Song generation failed. Please try again.' })
  }
})

// ─────────────────────────────
// POST /ai/improve-lyrics
// ─────────────────────────────
router.post('/improve-lyrics', async (req, res) => {
  try {
    const result = await improveLyrics(req.body)
    await req.user.incrementUsage()
    res.json({ success: true, result, aiUsage: req.user.aiUsage })
  } catch (err) {
    console.error('Lyrics improvement error:', err)
    res.status(500).json({ success: false, message: 'Lyrics improvement failed. Please try again.' })
  }
})

// ─────────────────────────────
// POST /ai/story
// ─────────────────────────────
router.post('/story', async (req, res) => {
  try {
    const result = await generateStory(req.body)
    await req.user.incrementUsage()
    res.json({ success: true, result, aiUsage: req.user.aiUsage })
  } catch (err) {
    console.error('Story generation error:', err)
    res.status(500).json({ success: false, message: 'Story generation failed. Please try again.' })
  }
})

// ─────────────────────────────
// POST /ai/script
// ─────────────────────────────
router.post('/script', async (req, res) => {
  try {
    const result = await generateScript(req.body)
    if (result.copyrightRefused) {
      return res.json({ success: true, copyrightRefused: true, message: result.message })
    }
    await req.user.incrementUsage()
    res.json({ success: true, result, aiUsage: req.user.aiUsage })
  } catch (err) {
    console.error('Script generation error:', err)
    res.status(500).json({ success: false, message: 'Script generation failed. Please try again.' })
  }
})

// ─────────────────────────────
// POST /ai/blog
// ─────────────────────────────
router.post('/blog', async (req, res) => {
  try {
    const result = await generateBlog(req.body)
    await req.user.incrementUsage()
    res.json({ success: true, result, aiUsage: req.user.aiUsage })
  } catch (err) {
    console.error('Blog generation error:', err)
    res.status(500).json({ success: false, message: 'Blog generation failed. Please try again.' })
  }
})

// ─────────────────────────────
// POST /ai/social
// ─────────────────────────────
router.post('/social', async (req, res) => {
  try {
    const result = await generateSocial(req.body)
    await req.user.incrementUsage()
    res.json({ success: true, result, aiUsage: req.user.aiUsage })
  } catch (err) {
    console.error('Social generation error:', err)
    res.status(500).json({ success: false, message: 'Social post generation failed.' })
  }
})

// ─────────────────────────────
// POST /ai/ad
// ─────────────────────────────
router.post('/ad', async (req, res) => {
  try {
    const result = await generateAd(req.body)
    await req.user.incrementUsage()
    res.json({ success: true, result, aiUsage: req.user.aiUsage })
  } catch (err) {
    console.error('Ad generation error:', err)
    res.status(500).json({ success: false, message: 'Ad copy generation failed.' })
  }
})

// ─────────────────────────────
// POST /ai/chat
// ─────────────────────────────
router.post('/chat', async (req, res) => {
  try {
    const reply = await chat(req.body)
    // Chat uses less quota - only count every 3rd message
    if (Math.random() < 0.33) await req.user.incrementUsage()
    res.json({ success: true, reply, aiUsage: req.user.aiUsage })
  } catch (err) {
    console.error('Chat error:', err)
    res.status(500).json({ success: false, message: 'Chat failed. Please try again.' })
  }
})

module.exports = router
