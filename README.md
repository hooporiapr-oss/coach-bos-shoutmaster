# 🎯 Coach BOS — The Ultimate Esports Shoutmaster from Puerto Rico 🇵🇷

**GET COACHED.™**

Coach BOS is the AI authority on esports in Puerto Rico and the Caribbean. He's the voice every gamer on the island talks to — about GAMERGY, tournaments, strategy, the PR scene, game tips, and everything competitive gaming.

## What Is This

A standalone web service that serves:
- **Frontend**: Full-screen bilingual (EN/ES) chat interface at `/`
- **API**: Claude-powered chat endpoint at `/api/chat`
- **Brain**: Comprehensive system prompt with GAMERGY global knowledge, PR esports scene intel, and shoutmaster personality

## Stack

- **Runtime**: Node.js + Express
- **AI**: Anthropic Claude API (claude-sonnet-4-20250514)
- **Frontend**: Vanilla HTML/CSS/JS (no framework needed)
- **Hosting**: Render Web Service
- **Design**: BOS Esports design system (Bebas Neue + Outfit, dark/gold/teal)

## Setup

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/coach-bos-shoutmaster.git
cd coach-bos-shoutmaster

# Install
npm install

# Set your API key
export ANTHROPIC_API_KEY=your_key_here

# Run
npm start
```

## Deploy on Render

1. Push to GitHub
2. New Web Service → connect repo
3. Build: `npm install`
4. Start: `node server.js`
5. Add env var: `ANTHROPIC_API_KEY`
6. Deploy

## Files

```
coach-bos-shoutmaster/
├── public/
│   └── index.html        ← Chat interface (bilingual EN/ES)
├── server.js             ← Express server + Claude API proxy
├── system-prompt.md      ← Coach BOS brain (GAMERGY + PR esports + personality)
├── package.json
├── render.yaml
├── .gitignore
└── README.md
```

## Coach BOS Knows

- **GAMERGY**: Global history, every edition (Spain, Mexico, Argentina, USA, Egypt, Panama, El Salvador), World Tour 2026, Puerto Rico debut
- **PR Esports Scene**: First Attack PR, ESPR, Puerto Rico Esports League, PR Gaming League, Tech My School, PRGDA
- **Key People**: Ricardo "Mono" Román Ithier, Jomar Varela-Escapa, Ricardo Carrión
- **Stats**: 156 PR players, $1.1M+ in earnings, 514 tournaments
- **Games**: Valorant, LoL, Fortnite, CoD, Rocket League, Street Fighter, Tekken, FC/FIFA, and more
- **Training**: BOS Esports platform (Strobe Drill, FlickShot, Split Focus, Clutch Timer)

---

**Built by GoStar Digital LLC 🇵🇷**
**BOS Esports™ · GET COACHED.™**
