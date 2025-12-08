# 🤖 AI Chatbot Template

> **A white-label, embeddable AI chatbot you can sell to clients. Your first client is included — no signup required.**

Built with Next.js 15, Tailwind CSS, and powered by [Trainly AI](https://trainlyai.com).

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)

<p align="center">
  <img src="public/screenshots/landing-page.png" alt="Landing Page" width="700">
</p>

---

## 🛒 Before You Buy

Make sure you're ready:

- ✅ You have a **GitHub account**
- ✅ You can deploy to **Vercel** (free tier works)
- ✅ Your first chatbot comes **fully configured** (no Trainly signup needed)
- ✅ Additional clients require **Trainly workspaces** ([trainlyai.com](https://trainlyai.com))
- ✅ Works on **any website** that supports custom JavaScript

---

## 🎯 What You're Getting

| Component | What It Is | Who It's For |
|-----------|------------|--------------|
| **Landing Page** (`/`) | A demo/showcase page for YOUR agency | You (to demo the product) |
| **Chat Widget** | The embeddable chatbot | Your clients' websites |
| **Admin Panel** (`/admin`) | Where you configure the bot | You (to manage each client) |

### ⚠️ Important: How This Works

```
┌─────────────────────────────────────────────────────────────────┐
│                         YOUR AGENCY                              │
│                                                                  │
│   This template = 1 chatbot for 1 client                        │
│                                                                  │
│   Client #1: Use the included API keys (no signup needed!)      │
│   Client #2+: Sign up for Trainly, get new keys, clone repo     │
│                                                                  │
│   Each client needs their OWN:                                   │
│   ✓ Copy of this repo                                           │
│   ✓ Trainly API Key & Chat ID                                   │
│   ✓ Deployment (Vercel, etc.)                                   │
│   ✓ Branding configuration                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎨 **White-Label Ready** | Easy branding configuration in one file |
| 💬 **Beautiful Chat Widget** | Modern, responsive — embed on any website |
| 📦 **One-Line Embed** | `<script src="...">` — works everywhere |
| 🔐 **Secure Admin Panel** | Manage prompts, upload docs, configure AI |
| 📄 **Knowledge Base** | Upload PDFs, docs, CSVs to train the bot |
| 🚀 **One-Click Deploy** | Ready for Vercel |

---

## ❌ What's NOT Included

This template is laser-focused on one thing: **embeddable AI chatbots**.

| Not Included | Why |
|--------------|-----|
| Client billing / Stripe | You handle payments your way |
| User accounts for end-customers | The widget is anonymous |
| Multi-tenant dashboard | One deployment = one client |
| Custom AI model training | Trainly handles the AI |
| Backend database | Trainly stores everything |

This keeps the template simple, reliable, and easy to customize.

---

## 🔒 Security & Privacy

### Your API Key is Safe

> **Your Trainly API key is stored securely on the server and is never exposed to the browser.**

All AI requests are made server-side through Next.js API routes.

### SEO & Indexing

> **The chat widget is served inside an iframe and is not indexable by search engines.**

Your clients' SEO won't be affected by the chatbot content.

### How It Works

- ✅ **Server-side API calls** — API key never sent to browser
- ✅ **httpOnly cookies** — Session tokens can't be stolen via JavaScript
- ✅ **JWT signing** — Cryptographically signed with HS256
- ✅ **Middleware protection** — Admin routes require authentication

---

## ⚡ Reliability

> **Trainly handles all retrieval, embeddings, and AI generation. This template is purely the frontend + admin wrapper — no model hosting required.**

You don't need to worry about:
- GPU servers
- Vector databases
- Model updates
- Rate limiting

Trainly handles the AI infrastructure. You focus on selling to clients.

---

## 🚀 Quick Start — Your First Client

**No Trainly signup needed!** This template includes pre-configured API keys for your first client.

> 💡 **Note:** The included API keys are unique to your purchase and tied to a single Trainly workspace provisioned for you. They are not shared with other buyers.

### Step 1: Clone & Install

```bash
git clone <your-repo-url> client-1-chatbot
cd client-1-chatbot
npm install
```

### Step 2: Configure Environment

```bash
cp env.template .env.local
```

Open `.env.local` and set:

```env
# ✅ These are included with your purchase (unique to you)
TRAINLY_API_KEY=<included in your purchase>
TRAINLY_CHAT_ID=<included in your purchase>

# 🔐 Set these yourself
ADMIN_PASSWORD=choose_a_strong_password
JWT_SECRET=<run: openssl rand -base64 32>
```

### Step 3: Run It

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — your first chatbot is running! 🎉

### Step 4: Customize for Your Client

Edit `src/config/branding.ts`:

```typescript
export const branding = {
  companyName: 'Client Company Name',
  chatbotName: 'Client Support Bot',
  welcomeMessage: 'Hi! How can I help you today?',
  // ... more options
};
```

### Step 5: Deploy & Give Client the Embed Code

1. Deploy to Vercel
2. Go to `/admin` → copy the embed code
3. Give this to your client:

```html
<script src="https://clientname.vercel.app/widget.js" defer></script>
```

---

## 👥 Adding More Clients

For your **second client and beyond**, you'll need your own Trainly account.

### For Each New Client:

1. **Sign up at [trainlyai.com](https://trainlyai.com)** (if you haven't already)
2. **Create a new chatbot** in Trainly dashboard
3. **Copy the API Key and Chat ID**
4. **Clone this repo again** for the new client:
   ```bash
   git clone <your-repo-url> client-2-chatbot
   cd client-2-chatbot
   npm install
   ```
5. **Use the NEW API keys** in `.env.local`
6. **Update branding** for the new client
7. **Deploy** to a new Vercel project

### Why Separate Deployments?

Each client gets their own:
- ✅ API keys (their data stays separate)
- ✅ Knowledge base (trained on THEIR documents)
- ✅ Branding (their company name, colors)
- ✅ Domain (clientname.vercel.app or custom)

**Never share API keys between clients!**

---

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page (YOUR demo)
│   │   ├── embed/                # Widget for embedding
│   │   ├── admin/                # Admin dashboard
│   │   └── actions/              # Server actions (Trainly API)
│   ├── components/
│   │   └── ChatWidget.tsx        # The chat widget
│   ├── config/
│   │   └── branding.ts           # ⭐ CUSTOMIZE HERE
│   └── lib/
│       └── auth.ts               # Authentication
├── public/
│   └── widget.js                 # Embeddable script
└── env.template                  # Environment template
```

---

## 🎨 Customization

### Branding (One File!)

Edit `src/config/branding.ts`:

```typescript
export const branding = {
  // Client's company
  companyName: 'Acme Corp',
  tagline: 'Smart support, instant answers',

  // Chatbot personality
  chatbotName: 'Acme Assistant',
  welcomeMessage: 'Hi! How can I help you today?',
  suggestedQuestions: ['What do you sell?', 'How do I contact support?'],

  // Remove Trainly branding (white-label)
  showPoweredBy: false,
};
```

### Colors

Edit CSS variables in `src/app/globals.css`:

```css
:root {
  --amber-primary: #fbbf24;    /* Change to client's brand color */
  --amber-secondary: #f59e0b;
}
```

---

## 📦 The Product: Embeddable Widget

**This is what you're selling** — a chat widget that works on any website.

<p align="center">
  <img src="public/screenshots/chatbox-convo-final.png" alt="Chat Widget" width="350">
</p>

### How Clients Use It

You give them one line of code:

```html
<script src="https://their-chatbot.vercel.app/widget.js" defer></script>
```

They paste it before `</body>` on their website. Done!

### Works On:
- ✅ WordPress
- ✅ Shopify
- ✅ Webflow
- ✅ Wix
- ✅ Squarespace
- ✅ Any HTML website

### Programmatic Control (Optional)

```javascript
TrainlyWidget.open();   // Open chat
TrainlyWidget.close();  // Close chat
TrainlyWidget.toggle(); // Toggle
```

---

## 🔐 Admin Dashboard

Access at `/admin` with your `ADMIN_PASSWORD`.

### What You Can Do:
- **📝 Edit System Prompt** — Define the AI's personality and rules
- **⚙️ Model Settings** — Temperature, max tokens, model selection
- **📁 Upload Documents** — Train the bot on client's PDFs, docs, etc.
- **📋 Get Embed Code** — Copy-paste for client's website

---

## 🚀 Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import to [vercel.com](https://vercel.com)
3. Add environment variables:
   - `TRAINLY_API_KEY`
   - `TRAINLY_CHAT_ID`
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`
4. Deploy!

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TRAINLY_API_KEY` | ✅ | Trainly API key |
| `TRAINLY_CHAT_ID` | ✅ | Trainly Chat ID |
| `ADMIN_PASSWORD` | ✅ | Admin panel password |
| `JWT_SECRET` | ✅ | At least 32 characters |

---

## 💰 Pricing Your Service

### Suggested Pricing

| Service | Price |
|---------|-------|
| Setup Fee | $500 - $2,000 |
| Monthly Retainer | $200 - $500/month |
| Document Training | $100 - $300/hour |
| Custom Features | $150/hour |

### What Clients Pay For:
- Initial setup and customization
- Monthly hosting and maintenance
- AI usage (included in your Trainly plan)
- Ongoing document updates
- Support

---

## 🛠️ Troubleshooting

### Chat not responding
1. Check API keys in `.env.local`
2. Verify Trainly dashboard shows the chatbot as active
3. Check browser console for errors

### Admin login not working
1. Ensure `JWT_SECRET` is 32+ characters
2. Clear cookies and retry
3. Check `ADMIN_PASSWORD` matches

### Widget not appearing on client's site
1. Check embed code has correct domain
2. Verify `/widget.js` is accessible
3. Check for CSP restrictions on client's site

### Widget loads but shows blank / broken
1. **Check if client's site blocks iframes** from external domains
2. Some website builders (Wix, etc.) have `<iframe sandbox>` restrictions
3. Ask client to whitelist your domain or disable iframe restrictions
4. Test on a simple HTML page first to isolate the issue

### CORS errors
1. API routes are server-side, so CORS shouldn't affect them
2. If embedding fails, check client's site security settings

---

## ❓ FAQ

**Q: Do I need to sign up for Trainly?**
> Not for your first client — API keys are included! For additional clients, sign up at [trainlyai.com](https://trainlyai.com).

**Q: Can I use this for multiple clients?**
> Yes! Clone the repo for each client. Each client needs their own API keys and deployment.

**Q: What's the landing page for?**
> It's a demo page for YOUR agency to showcase the product. You don't give this to clients — you give them the embed code.

**Q: Can I remove "Powered by Trainly"?**
> Yes, set `showPoweredBy: false` in `branding.ts`.

**Q: How do I train the bot on client documents?**
> Go to `/admin` → Knowledge Base → Upload files (PDF, TXT, CSV, etc.)

**Q: Does the widget work on [platform]?**
> If it allows custom JavaScript and iframes, yes. Works on WordPress, Shopify, Webflow, Wix, etc.

**Q: Will the chatbot affect my client's SEO?**
> No. The widget loads in an iframe and is not indexed by search engines.

**Q: Is my API key secure?**
> Yes. It's stored server-side and never exposed to the browser.

---

## 📝 Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # Lint code
```

---

## 📜 License

You may use this template for **unlimited client projects**.

**You may NOT:**
- Resell the source code as your own template
- Redistribute the template on marketplaces
- Claim the template as your original work

For personal agency use and client deployments only.

---

## 🔗 Resources

- **Trainly**: [trainlyai.com](https://trainlyai.com)
- **Next.js**: [nextjs.org](https://nextjs.org)
- **Vercel**: [vercel.com](https://vercel.com)

---

<div align="center">

**Built for AI agencies** 🚀

Your first client is ready to go. Start selling!

</div>
