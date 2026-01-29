# 🚀 VocabMaster: IELTS Mastery with Grok AI

VocabMaster is a premium, AI-powered vocabulary learning platform designed specifically for IELTS Writing Task 2. Elevate your lexical resource with context-aware synonyms, complex sentence structures, and natural translations—all powered by **Llama 3.3 (Grok AI)**.

![Premium UI Showcase](https://raw.githubusercontent.com/romizzidiamly/vocabmaster/main/public/preview.png) *(Note: Placeholder for your actual preview image)*

## ✨ Key Features

- **🧠 Grok AI Integration**: Generate context-specific definitions, phonetics, and IELTS-grade example sentences on the fly.
- **📚 Four IELTS Sentence Types**: Every word includes examples in **Simple**, **Complex**, **Compound**, and **Compound-Complex** structures.
- **🇮🇩 Natural Translations**: Context-aware Indonesian translations prioritized for meaning over literal word-for-word translation.
- **📂 Excel Bulk Upload**: Seamlessly import your custom vocabulary lists from Excel.
- **🎮 Interactive Practice Mode**: Verify your mastery by recalling synonyms for discovered words.
- **💎 Premium Design System**: A high-fidelity, polished UI with glassmorphism, smooth animations (Framer Motion), and perfect contrast.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **AI**: [Groq Cloud API](https://groq.com/) (Llama-3.3-70b-versatile)
- **Styling**: Tailwind CSS & Vanilla CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Parsing**: xlsx (SheetJS)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/romizzidiamly/vocabmaster.git
cd vocabmaster
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to start your mastery journey.

## 📁 Project Structure

- `/components`: UI components (RecallTable, DataPreview, etc.)
- `/context`: Global state management for vocabulary data.
- `/lib`: Helper functions for AI generation and Excel parsing.
- `/app/api/ai`: Groq Cloud API integration route.

## 🎯 Our Focus: IELTS Excellence
This app is built to solve the #1 problem in IELTS Writing: **Repetitive Vocabulary**. By focusing on synonyms and diverse sentence structures, VocabMaster helps you hit that Band 7+ Lexical Resource and Grammatical Range & Accuracy.

---
Built with ❤️ by Romi & Antigravity AI
