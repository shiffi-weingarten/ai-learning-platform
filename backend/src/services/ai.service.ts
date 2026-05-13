import OpenAI from 'openai';

const MOCK_RESPONSES: Record<string, string> = {
  default: `# Lesson Overview

Welcome to this lesson! Here's what you'll learn:

## Key Concepts
1. **Fundamentals** - Understanding the core principles
2. **Practical Application** - How to apply what you've learned
3. **Best Practices** - Industry-standard approaches

## Summary
This topic is essential for building a strong foundation. Practice regularly and refer back to this lesson as needed.

> 💡 **Tip:** The best way to learn is by doing. Try to apply each concept with a small exercise.`,
};

function buildMockResponse(category: string, subCategory: string, prompt: string): string {
  return `# ${subCategory} Lesson: ${prompt}

## Introduction
Welcome to this lesson on **${subCategory}** (part of the **${category}** category).

## Core Concepts

### What is ${subCategory}?
${subCategory} is a fundamental topic within ${category}. Understanding it will help you build a strong foundation.

### Key Points
- **Point 1**: Start with the basics and build up gradually
- **Point 2**: Practice consistently to reinforce your understanding  
- **Point 3**: Connect new knowledge to what you already know

## Detailed Explanation
Your question was: *"${prompt}"*

This is an excellent question! Here's a structured answer:

1. **First**, understand the underlying principles
2. **Then**, explore practical examples
3. **Finally**, apply the knowledge in real scenarios

## Practice Exercise
Try to solve a small problem related to "${prompt}" on your own. This will solidify your understanding.

## Summary
You've covered the essentials of **${subCategory}**. Keep practicing and exploring!

> 📚 **Next Steps**: Explore more advanced topics in ${category} to deepen your knowledge.`;
}

export async function generateLesson(
  category: string,
  subCategory: string,
  userPrompt: string
): Promise<string> {
  if (process.env.USE_AI_MOCK === 'true' || !process.env.OPENAI_API_KEY) {
    return buildMockResponse(category, subCategory, userPrompt);
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content:
          'You are an expert educator. Generate a clear, structured, markdown-formatted lesson based on the user\'s topic and question. Include an introduction, key concepts, explanation, and a summary.',
      },
      {
        role: 'user',
        content: `Category: ${category}\nSub-category: ${subCategory}\nQuestion/Topic: ${userPrompt}`,
      },
    ],
    max_tokens: 800,
  });

  return completion.choices[0].message.content ?? MOCK_RESPONSES.default;
}
