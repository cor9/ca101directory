# AI Integration

The CA101 ecosystem incorporates AI to enhance productivity and vendor credibility.

## Current AI Applications
- **Prep101** — Audition preparation guide generator  
- **Resume101** — Conversational resume builder for parents  
- **Listing Assistant** — Auto-suggests business category tags and SEO blurbs  
- **RAG Chatbot** — Supports contextual Q&A for site visitors using embedded data  

## AI Providers
- **OpenAI GPT-5** (primary)
- **Anthropic Claude** (secondary)
- Vector retrieval via **Supabase Edge Functions**

## Configuration
Environment variables:
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

## Best Practice
- All AI output reviewed manually before publishing  
- Never expose API keys client-side  
- Maintain human-first, ethical content tone
