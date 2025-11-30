# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SelfOrWorld** is a personal development application based on the philosophical premise that consciousness ("Self") and the world are interdependent. The app helps users achieve freedom by understanding the nature of consciousness and the world.

### Target User Profile
- Feels frustrated by living passively without being driven by inner motivation
- Gets distracted by immediate temptations and forgets important things
- Avoids thinking about the future but senses it's important

### Core Value Proposition
SelfOrWorld provides three key experiences:
1. **Daily reminders of what matters** - Helping users stay connected to their deep values
2. **Living the future now** - Planning and experiencing future time periods in advance
3. **Giving meaning to the past** - Structured reflection and learning from experience

## Architecture & Features (Planned)

### 1. WorldTree (価値観の記録と鮮明化)
**Purpose**: Record and clarify core values through differentiated data structures.

**Key Concepts**:
- Single master statement of ideal state that users reference daily
- Branching details to make the vision more vivid (how to face challenges, what role to play for others, who to think of with compassion)
- Helps users touch their deep values through guided questions like:
  - "If today were your last day, what state would you want to be in?"
  - "If the world ended today, how would you spend your time?"

**Design Principle**: The more vividly imagined, the more compelling the vision becomes. Vague imagination doesn't lead to clear action.

### 2. Compact (未来の圧縮体験)
**Purpose**: Help users feel the future compactly from their current perspective.

**Key Concepts**:
- Start by reviewing whether the upcoming week feels harmonious
- View the week in various formats to assess time allocation
- Experience living a full week at once, then "look back" on that future
- Identify if too much time is spent on undesirable activities

### 3. Immersion (明日の準備)
**Purpose**: Display reality divided by time periods to help users live better tomorrow.

**Key Concepts**:
- Time-segmented view of the day ahead
- Pre-planning notes on how to achieve harmony in each segment
- Accept unpredictability but prepare for what can be predicted
- Prepare until feeling sufficiently confident

**Philosophy**: It's okay to remain anxious sometimes - we escape unpredictability through action.

### 4. ReLiving (過去からの学び)
**Purpose**: Structured daily reflection to extract learning from experience.

**Key Concepts**:
- Review the day from beginning to end after completion
- Record learnings from each moment
- Learning helps clarify "what matters" and improve execution
- Avoid meaningless dwelling on past (shame from failures, disappointment from comparing past success to present)
- Focus on: analyzing failures to avoid repetition, analyzing successes to make them reproducible

**Workflow Philosophy**:
- During the day: Don't reflect on each action, just immerse in what needs doing
- If you've "lived the future" via Immersion, what to do at each time is predetermined (barring important interruptions)
- Execute steadily, then reflect after the day ends

## Development Principles

### User Experience Philosophy
- "Self" (私) is unique to each speaker - this app is personal and individual
- What matters to current-me likely matters to tomorrow-me (if not, it may not matter today either)
- Time is finite, can't do multiple things simultaneously, the world has order - these are facts to accept when planning the future
- The only meaningful relationship with the past is learning and applying lessons, not emotional dwelling

### Language & Culture
- Primary documentation and UI is in Japanese
- Philosophical depth is core to the product - not just a productivity tool
- Balance between existential reflection and practical action

## Current State

### Frontend Implementation (Mock)

A frontend mock implementation has been completed in the `frontend/` directory using:
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation

All four core features have been implemented as interactive mockups:
- WorldTree (価値観ツリー) - Tree structure for values with expand/collapse
- Compact (週間ビュー) - Weekly time allocation with chart/list views
- Immersion (日次タイムライン) - Daily timeline with category-coded time blocks
- ReLiving (振り返り) - Daily reflection with emotion tracking and learnings

**Important Notes**:
- All data is currently hardcoded - no persistence layer exists yet
- No backend API exists - this is pure frontend mockup
- Located in `frontend/` directory
- Run with `cd frontend && npm install && npm run dev`
- Accessible at http://localhost:5173/

### Development Commands

```bash
# Start frontend development server
cd frontend && npm run dev

# Build frontend for production
cd frontend && npm run build
```

### Implementation Guidelines

When extending this codebase:

1. Maintain the philosophical foundation - this isn't generic productivity software
2. The four features (WorldTree, Compact, Immersion, ReLiving) form an integrated system for the full cycle: values → future planning → execution → reflection → refined values
3. Single-user focused ("for me, above all else" - まず何よりも私のために)
4. Emphasis on vividness and concreteness in visualization to drive action
5. UI text should be in Japanese to maintain cultural authenticity
