/**
 * AI Service Layer – connects to IBM Granite (Watsonx) with fallback mock for development
 */

const axios = require('axios')

// ─────────────────────────────────────────────────────────
// IBM Watsonx Authentication
// ─────────────────────────────────────────────────────────
let ibmToken = null
let ibmTokenExpiry = 0

async function getIBMToken() {
  if (ibmToken && Date.now() < ibmTokenExpiry) return ibmToken

  const res = await axios.post('https://iam.cloud.ibm.com/identity/token', null, {
    params: {
      grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
      apikey: process.env.IBMCLOUD_API_KEY,
    },
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })

  ibmToken = res.data.access_token
  ibmTokenExpiry = Date.now() + (res.data.expires_in - 300) * 1000 // Refresh 5 min early
  return ibmToken
}

// ─────────────────────────────────────────────────────────
// Core Granite call
// ─────────────────────────────────────────────────────────
async function callGranite(prompt, systemPrompt = '', maxTokens = 2048) {
 if (process.env.USE_MOCK_AI === 'true' || !process.env.IBMCLOUD_API_KEY) {

    if (systemPrompt === SYSTEM_PROMPTS.song)
        return generateMockResponse('song', prompt)

    if (systemPrompt === SYSTEM_PROMPTS.story)
        return generateMockResponse('story', prompt)

    if (systemPrompt === SYSTEM_PROMPTS.script)
        return generateMockResponse('script', prompt)

    if (systemPrompt === SYSTEM_PROMPTS.blog)
        return generateMockResponse('blog', prompt)

    if (systemPrompt === SYSTEM_PROMPTS.social)
        return generateMockResponse('social', prompt)

    if (systemPrompt === SYSTEM_PROMPTS.ad)
        return generateMockResponse('ad', prompt)

    if (systemPrompt === SYSTEM_PROMPTS.lyrics)
        return generateMockResponse('lyrics', prompt)

    return 'Mock Response'
}

  const token = await getIBMToken()

  const response = await axios.post(
    `${process.env.IBM_GRANITE_URL}/ml/v1/text/generation`,
    {
      model_id: process.env.IBM_GRANITE_MODEL_ID || 'ibm/granite-13b-chat-v2',
      input: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt,
      parameters: {
        decoding_method: 'greedy',
        max_new_tokens: maxTokens,
        repetition_penalty: 1.1,
        temperature: 0.85,
        top_k: 50,
        top_p: 0.95,
      },
      project_id: process.env.IBM_GRANITE_PROJECT_ID,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000, // 60s timeout
    }
  )

  return response.data.results?.[0]?.generated_text || ''
}

// ─────────────────────────────────────────────────────────
// Prompt builders
// ─────────────────────────────────────────────────────────
const SYSTEM_PROMPTS = {
  song: `You are an expert songwriter and lyricist. Generate complete, emotionally resonant song lyrics based on the user's specifications. Always return valid JSON with the structure: {"title":"","verse1":"","chorus":"","verse2":"","bridge":"","outro":"","chordProgression":"","musicalKey":"","tempo":"","notes":""}`,

  lyrics: `You are a professional lyric analyst and songwriter. Analyze the provided lyrics and return an improved version with detailed explanations. Return valid JSON: {"originalLyrics":"","improvedLyrics":"","improvements":{"emotionalImpact":"","flow":"","wordChoice":"","rhyming":"","imagery":"","readability":""},"overallNotes":""}`,

  story: `You are a master storyteller and novelist. Generate original, compelling stories based on user prompts. Return valid JSON: {"title":"","synopsis":"","characters":[{"name":"","role":"","description":""}],"chapters":[{"title":"","content":""}],"ending":"","alternativeEnding":""}`,

  script: `You are a professional screenwriter. Generate original movie/short-film scripts. IMPORTANT: Never reproduce copyrighted material. If asked to write scripts for specific existing films, politely decline and offer an original inspired alternative. Return valid JSON: {"title":"","logline":"","characters":[{"name":"","description":""}],"synopsis":"","scenes":[{"number":1,"location":"","time":"","description":"","dialogue":""}]}`,

  blog: `You are an expert content writer and SEO specialist. Write engaging, informative blog posts. Return valid JSON: {"title":"","introduction":"","sections":[{"heading":"","content":""}],"conclusion":"","seoMeta":""}`,

  social: `You are a social media marketing expert. Create engaging platform-optimized social media posts. Return valid JSON: {"posts":[{"platform":"","content":"","hashtags":"","notes":""}]}`,

  ad: `You are a direct-response copywriter. Create compelling advertisement copy that converts. Generate 3 variants. Return valid JSON: {"variants":[{"headline":"","body":"","cta":"","notes":""}]}`,

  chat: `You are ForgeMuse AI, a helpful AI creative collaborator. You assist writers, musicians, storytellers, and creators with their creative projects. Be supportive, specific, and inspiring. Provide actionable creative advice.`,
}

// ─────────────────────────────────────────────────────────
// COPYRIGHT CHECK
// ─────────────────────────────────────────────────────────
const COPYRIGHTED_WORKS = [
  'iron man', 'spider-man', 'batman', 'superman', 'avengers', 'star wars',
  'harry potter', 'lord of the rings', 'game of thrones', 'breaking bad',
  'the matrix', 'titanic', 'inception', 'interstellar', 'frozen',
]

function detectCopyrightedContent(text) {
  const lower = text.toLowerCase()
  return COPYRIGHTED_WORKS.some(work => lower.includes(work))
}

// ─────────────────────────────────────────────────────────
// Exported AI functions
// ─────────────────────────────────────────────────────────
async function generateSong(params) {
  const { theme, emotion, genre, language, mood, structure, additionalNotes } = params
  const prompt = `Write a complete ${genre} song in ${language}.
Theme: ${theme}
Emotion: ${emotion}
Mood: ${mood}
Structure: ${structure}
${additionalNotes ? `Special notes: ${additionalNotes}` : ''}

Generate a complete song with all sections. Make it emotionally powerful, poetic, and original. Include chord progressions, musical key, and BPM tempo suggestion.`

  const raw = await callGranite(prompt, SYSTEM_PROMPTS.song, 2048)
  return parseJSON(raw, getSongFallback(theme, genre))
}

async function improveLyrics(params) {
  const { lyrics, focusArea, additionalNotes, round } = params
  const prompt = `Analyze and improve these song lyrics.
Focus Area: ${focusArea}
Round: ${round} (make each round progressively more refined)
${additionalNotes ? `Style notes: ${additionalNotes}` : ''}

ORIGINAL LYRICS:
${lyrics}

Improve the lyrics focusing on ${focusArea}. Provide detailed analysis of each improvement dimension.`

  const raw = await callGranite(prompt, SYSTEM_PROMPTS.lyrics, 2048)
  return parseJSON(raw, getLyricsFallback(lyrics))
}

async function generateStory(params) {
  const { prompt, genre, tone, length, protagonist, setting } = params
  const storyPrompt = `Write an original ${genre} story.
Tone: ${tone}
Length: ${length}
${protagonist ? `Main character: ${protagonist}` : ''}
${setting ? `Setting: ${setting}` : ''}
Concept: ${prompt}

Create a complete story with compelling characters, chapters, and both a main and alternative ending.`

  const raw = await callGranite(storyPrompt, SYSTEM_PROMPTS.story, 3000)
  return parseJSON(raw, getStoryFallback(prompt))
}

async function generateScript(params) {
  const { concept, genre, scriptType, protagonist, antagonist, setting } = params

  if (detectCopyrightedContent(concept)) {
    return { copyrightRefused: true, message: `I can't generate scripts based on copyrighted works. However, I can write you an original ${genre} script inspired by the same themes and style! Simply describe your own concept and I'll craft something unique for you.` }
  }

  const scriptPrompt = `Write an original ${scriptType} script in the ${genre} genre.
Concept: ${concept}
${protagonist ? `Protagonist: ${protagonist}` : ''}
${antagonist ? `Antagonist/Conflict: ${antagonist}` : ''}
${setting ? `Setting: ${setting}` : ''}

Generate a complete original script with scene breakdowns and dialogue. This must be 100% original content.`

  const raw = await callGranite(scriptPrompt, SYSTEM_PROMPTS.script, 3000)
  return parseJSON(raw, getScriptFallback(concept))
}

async function generateBlog(params) {
  const { topic, category, tone, length, keywords, targetAudience } = params
  const prompt = `Write a ${tone} ${category} blog post.
Topic: ${topic}
Length: ${length}
${keywords ? `SEO Keywords: ${keywords}` : ''}
${targetAudience ? `Target Audience: ${targetAudience}` : ''}

Create a well-structured, engaging blog post with introduction, multiple sections, and a strong conclusion.`

  const raw = await callGranite(prompt, SYSTEM_PROMPTS.blog, 2500)
  return parseJSON(raw, getBlogFallback(topic))
}

async function generateSocial(params) {
  const { topic, platform, postType, tone, callToAction, hashtags } = params
  const prompt = `Create a ${postType} post for ${platform}.
Topic: ${topic}
Tone: ${tone}
${callToAction ? `CTA: ${callToAction}` : ''}
${hashtags ? 'Include relevant hashtags.' : 'No hashtags needed.'}

Create 3 platform-optimized social media post variants.`

  const raw = await callGranite(prompt, SYSTEM_PROMPTS.social, 1500)
  return parseJSON(raw, getSocialFallback(topic, platform))
}

async function generateAd(params) {
  const { product, audience, uniqueValue, adType, tone, callToAction, offer } = params
  const prompt = `Write 3 ${adType} ad copy variants.
Product/Service: ${product}
${audience ? `Target Audience: ${audience}` : ''}
${uniqueValue ? `Unique Value: ${uniqueValue}` : ''}
Tone: ${tone}
${callToAction ? `CTA: ${callToAction}` : ''}
${offer ? `Special Offer: ${offer}` : ''}

Create compelling, conversion-focused ad copy with headlines, body, and CTAs.`

  const raw = await callGranite(prompt, SYSTEM_PROMPTS.ad, 1500)
  return parseJSON(raw, getAdFallback(product))
}

async function chat(params) {
  const { message, context, history = [], projectType } = params
  const contextNote = context ? `\n\nProject context:\n${context.substring(0, 1000)}` : ''
  const historyStr = history.slice(-8).map(m => `${m.role === 'user' ? 'Human' : 'Assistant'}: ${m.content}`).join('\n')

  const prompt = `${historyStr ? historyStr + '\n' : ''}Human: ${message}${contextNote}\nAssistant:`

  const raw = await callGranite(prompt, SYSTEM_PROMPTS.chat, 1024)
  return raw.trim() || "I'm here to help with your creative work! Could you tell me more about what you're working on?"
}

// ─────────────────────────────────────────────────────────
// JSON parser with fallback
// ─────────────────────────────────────────────────────────
function parseJSON(raw, fallback) {
  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (jsonMatch) return JSON.parse(jsonMatch[0])
  } catch {}
  return fallback
}

// ─────────────────────────────────────────────────────────
// Mock/fallback responses for dev
// ─────────────────────────────────────────────────────────
function generateMockResponse(type, prompt = '') {
  switch (type) {
    case 'song':
      return JSON.stringify(getSongFallback(prompt, 'Pop'))

    case 'story':
      return JSON.stringify(getStoryFallback(prompt))

    case 'script':
      return JSON.stringify(getScriptFallback(prompt))

    case 'blog':
      return JSON.stringify(getBlogFallback(prompt))

    case 'social':
      return JSON.stringify(getSocialFallback(prompt, 'Instagram'))

    case 'ad':
      return JSON.stringify(getAdFallback(prompt))

    case 'lyrics':
      return JSON.stringify(getLyricsFallback(prompt))

    default:
      return `I'm ForgeMuse AI 🎵

I can help you with songwriting, stories, lyrics, characters, music ideas, and creative brainstorming.

You asked:
"${prompt}"

Here is an idea:
- Explore the emotion behind your concept
- Create a strong theme
- Build characters or lyrics around it

Tell me more details and I'll help you create it!`
  }
}
function getSongFallback(theme, genre) {
  return {
    title: `Song about ${theme.substring(0, 30)}`,
    verse1: 'Walking down this empty road,\nCarrying my heart like a heavy load,\nThe echoes fade but memories stay,\nHolding onto yesterday.',
    chorus: 'But I keep moving forward, keep moving on,\nFinding strength in every song,\nThrough the night and into dawn,\nThis is where I belong.',
    verse2: 'The seasons change, the rivers flow,\nSomewhere deep inside I know,\nThat every end is just a start,\nA new beginning for this heart.',
    bridge: 'And in the silence I can hear,\nThe voice that tells me not to fear.',
    outro: 'Let the music guide the way...',
    chordProgression: 'C - Am - F - G',
    musicalKey: 'C major',
    tempo: '105 BPM',
    notes: `${genre} song generated with default parameters.`,
  }
}

function getLyricsFallback(originalLyrics) {
  return {
    originalLyrics,
    improvedLyrics: originalLyrics + '\n\n[Improved version — Connect IBM Granite for real AI improvements]',
    improvements: {
      emotionalImpact: 'The emotional tone has been deepened to create stronger resonance with listeners.',
      flow: 'Syllable patterns have been adjusted for better rhythmic consistency.',
      wordChoice: 'Generic words have been replaced with more evocative, specific language.',
      rhyming: 'Rhyme scheme has been strengthened for consistency throughout.',
      imagery: 'Abstract concepts have been replaced with concrete, sensory-rich images.',
      readability: 'Sentence structure has been varied to improve overall readability.',
    },
    overallNotes: 'The improvements focus on making the lyrics more emotionally impactful and musically accessible.',
  }
}

function getStoryFallback(prompt) {
  return {
    title: 'The Unexpected Journey',
    synopsis: `A story inspired by: ${prompt.substring(0, 100)}`,
    characters: [
      { name: 'Alex Rivera', role: 'Protagonist', description: 'A determined individual facing impossible odds' },
      { name: 'Morgan Blake', role: 'Mentor', description: 'Wise guide who appears at crucial moments' },
    ],
    chapters: [
      { title: 'Chapter 1: The Beginning', content: 'The morning light filtered through dusty windows as Alex stared at the map that had arrived anonymously. Three years of searching, and now this — coordinates to somewhere that shouldn\'t exist.' },
      { title: 'Chapter 2: The Discovery', content: 'The path wound through ancient forest, each step taking Alex further from the familiar world. When the trees parted, what lay beyond defied every expectation.' },
    ],
    ending: 'What was found changed everything. Not the treasure Alex had sought, but something far more valuable — the truth about who they really were.',
    alternativeEnding: 'The journey ended not where Alex expected, but where it needed to. Sometimes the greatest discoveries are the ones we make about ourselves.',
  }
}

function getScriptFallback(concept) {
  return {
    title: 'Original Script',
    logline: `An original story about ${concept.substring(0, 60)}`,
    characters: [
      { name: 'ALEX', description: 'The protagonist, driven and resourceful.' },
      { name: 'MORGAN', description: 'The supporting character, complex motivations.' },
    ],
    synopsis: 'A compelling original story that explores themes of identity, choice, and consequence.',
    scenes: [
      { number: 1, location: 'INT. OFFICE BUILDING - LOBBY', time: 'DAY', description: 'A busy metropolitan office building. ALEX, 30s, sharp-eyed, moves through the crowd with purpose.', dialogue: 'ALEX\n(on phone)\nI found it. I finally found it.\n\n(pause)\n\nALEX (CONT\'D)\nYes, I\'m sure. Meet me in an hour.' },
      { number: 2, location: 'EXT. CITY STREET - CONTINUOUS', time: 'DAY', description: 'Alex exits the building, glancing over their shoulder. Something\'s not right.', dialogue: 'MORGAN\n(appearing suddenly)\nYou should have left it alone.\n\nALEX\nI couldn\'t. You know I couldn\'t.\n\nMORGAN\nThen we run. Now.' },
    ],
  }
}

function getBlogFallback(topic) {
  return {
    title: `The Complete Guide to ${topic}`,
    introduction: `In today's rapidly evolving landscape, ${topic} has become increasingly important for professionals and enthusiasts alike. This comprehensive guide will walk you through everything you need to know.`,
    sections: [
      { heading: 'Understanding the Basics', content: `Before diving deep, it's essential to establish a solid foundation. ${topic} encompasses several key principles that form the backbone of the entire subject.` },
      { heading: 'Advanced Strategies', content: 'Once you have the basics down, these advanced strategies will help you take things to the next level and achieve results that stand out from the competition.' },
      { heading: 'Common Mistakes to Avoid', content: 'Even experienced practitioners fall into these traps. Knowing what to avoid is just as important as knowing what to do.' },
    ],
    conclusion: `Understanding ${topic} is a journey, not a destination. Apply these insights consistently and you\'ll see meaningful progress over time.`,
    seoMeta: `Comprehensive guide to ${topic} with practical tips, strategies, and expert insights.`,
  }
}

function getSocialFallback(topic, platform) {
  return {
    posts: [
      { platform, content: `🚀 Exciting news about ${topic}! The future is here and it's more exciting than ever.\n\nHere's what you need to know →`, hashtags: '#Innovation #FutureTech #Growth', notes: 'High-engagement format with emoji and arrow hook.' },
      { platform, content: `The one thing most people get wrong about ${topic}:\n\nThey focus on the wrong metrics.\n\nHere's a different perspective that changed everything for us...`, hashtags: '#ContentMarketing #Business #Strategy', notes: 'Story-based format for higher retention.' },
      { platform, content: `📊 Quick stat: Companies that embrace ${topic} see 3x better results.\n\nAre you leaving results on the table?`, hashtags: '#DataDriven #Results', notes: 'Stat-based format to establish authority.' },
    ],
  }
}

function getAdFallback(product) {
  return {
    variants: [
      { headline: `Transform Your Work with ${product.substring(0, 25)}`, body: `Join thousands of professionals who have already discovered the power of this game-changing solution. See results from day one.`, cta: 'Try Free Today', notes: 'Benefit-focused variant' },
      { headline: `Finally — A Solution That Actually Works`, body: `Stop wasting time on outdated methods. ${product.substring(0, 40)} gives you everything you need to succeed, without the complexity.`, cta: 'Get Started Now', notes: 'Pain-point focused variant' },
      { headline: `Limited Time: Special Offer`, body: `Don't miss this opportunity to access ${product.substring(0, 30)} at an exclusive price. Trusted by industry leaders worldwide.`, cta: 'Claim Your Offer', notes: 'Urgency-based variant' },
    ],
  }
}

module.exports = { generateSong, improveLyrics, generateStory, generateScript, generateBlog, generateSocial, generateAd, chat }
