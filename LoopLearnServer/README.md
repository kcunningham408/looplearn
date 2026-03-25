# LoopLearn Server

AI-powered backend for the LoopLearn educational app, featuring LoopBot - an AI tutor for grades 1-6.

## Features

- **AI Teacher**: Chat with LoopBot for math and science help
- **Mistake Explanations**: Get personalized explanations for wrong answers
- **Learning Insights**: AI-powered analysis of learning patterns
- **Rate Limiting**: 30 requests/minute per IP for fair usage
- **Safety Filters**: Age-appropriate, educational content only

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy environment file:

   ```bash
   cp .env.example .env
   ```

3. Get a Grok API key from [xAI Console](https://console.x.ai/)

4. Add your API key to `.env`:

   ```
   XAI_API_KEY=your_actual_api_key_here
   ```

5. Start the server:
   ```bash
   npm start
   ```

The server runs on port 4000 by default.

## API Endpoints

- `GET /health` - Health check
- `POST /api/ai-teacher` - Chat with LoopBot
- `POST /api/explain-mistake` - Explain wrong answers
- `POST /api/learning-insights` - Analyze learning patterns

## AI Configuration

LoopBot uses xAI's Grok model with custom prompts optimized for:

- Grade-appropriate language (Grades 1-6)
- Short, engaging responses
- Educational focus on math and science
- Safe, positive interactions
