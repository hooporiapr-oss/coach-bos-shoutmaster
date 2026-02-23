const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ═══ LOAD SYSTEM PROMPT ═══
const systemPrompt = fs.readFileSync(
  path.join(__dirname, 'system-prompt.md'),
  'utf-8'
);

// ═══ ANTHROPIC CLIENT ═══
const anthropic = new Anthropic.default({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ═══ MIDDLEWARE ═══
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
    },
  },
}));

app.use(cors({
  origin: [
    'https://coach-bos-shoutmaster.onrender.com',
    'https://bosesports.com',
    'https://www.bosesports.com',
    'http://localhost:3000',
  ],
  methods: ['GET', 'POST'],
}));

app.use(express.json({ limit: '50kb' }));

// ═══ RATE LIMITING ═══
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,       // 1 minute
  max: 15,                    // 15 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many messages. Slow down, gamer. Try again in a minute.' },
});

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);

// ═══ SERVE STATIC FILES ═══
app.use(express.static(path.join(__dirname, 'public')));

// ═══ HEALTH CHECK ═══
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Coach BOS Shoutmaster',
    identity: 'The Ultimate Esports Shoutmaster from Puerto Rico 🇵🇷',
    version: '1.0.0',
  });
});

// ═══ CHAT ENDPOINT ═══
app.post('/api/chat', chatLimiter, async (req, res) => {
  try {
    const { message, history = [], lang = 'en' } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    if (message.length > 2000) {
      return res.status(400).json({ error: 'Message too long. Keep it under 2000 characters.' });
    }

    // Build conversation messages
    const messages = [];

    // Add recent history (last 20 exchanges max)
    const recentHistory = Array.isArray(history) ? history.slice(-20) : [];
    for (const msg of recentHistory) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        messages.push({
          role: msg.role,
          content: typeof msg.content === 'string' ? msg.content.slice(0, 2000) : '',
        });
      }
    }

    // Add current message
    messages.push({
      role: 'user',
      content: message.trim(),
    });

    // Add language context to system prompt
    const langContext = lang === 'es'
      ? '\n\n[LANGUAGE CONTEXT: The user is using the Spanish interface. Respond in Puerto Rican Spanish (boricua). Use natural boricua expressions.]'
      : '\n\n[LANGUAGE CONTEXT: The user is using the English interface. Respond in English.]';

    // Call Claude
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt + langContext,
      messages: messages,
    });

    // Extract text response
    const reply = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .trim();

    if (!reply) {
      return res.status(500).json({ error: 'Empty response from Coach BOS.' });
    }

    res.json({
      reply,
      usage: {
        input: response.usage?.input_tokens || 0,
        output: response.usage?.output_tokens || 0,
      },
    });

  } catch (err) {
    console.error('[Coach BOS Error]', err.message || err);

    if (err.status === 429) {
      return res.status(429).json({
        error: 'Coach BOS is getting too many requests right now. Try again in a few seconds.',
      });
    }

    if (err.status === 401) {
      return res.status(500).json({ error: 'API configuration error.' });
    }

    res.status(500).json({
      error: 'Coach BOS hit a wall. Try again.',
    });
  }
});

// ═══ CATCH-ALL → SERVE CHAT PAGE ═══
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ═══ START ═══
app.listen(PORT, () => {
  console.log(`\n🎯 COACH BOS SHOUTMASTER`);
  console.log(`   The Ultimate Esports Shoutmaster from Puerto Rico 🇵🇷`);
  console.log(`   Running on port ${PORT}`);
  console.log(`   GET COACHED.™\n`);
});
