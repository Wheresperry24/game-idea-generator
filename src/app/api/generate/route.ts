import { groq } from '@/utils/groq';
import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, type } = body;

    let systemPrompt = '';
    let userPrompt = '';

    if (type === 'enhance') {
      systemPrompt = "You are a creative game design expert. Enhance the user's game idea by adding innovative mechanics, features, and creative elements while maintaining the core concept.";
      userPrompt = `Enhance this game idea: ${prompt}\n\nProvide your response in this format:\nEnhanced Concept: [brief enhanced description]\nKey Features:\n- [feature 1]\n- [feature 2]\n- [feature 3]\nGameplay Mechanics:\n- [mechanic 1]\n- [mechanic 2]\nUnique Elements:\n- [element 1]\n- [element 2]`;
    } else if (type === 'random') {
      systemPrompt = "You are a creative game design expert. Generate unique and innovative game ideas that combine interesting mechanics, themes, and gameplay elements.";
      userPrompt = "Generate a random game idea that is unique and innovative. Make sure it's specific and detailed.\n\nProvide your response in this format:\nGame Concept: [brief description]\nCore Gameplay:\n- [gameplay element 1]\n- [gameplay element 2]\nKey Features:\n- [feature 1]\n- [feature 2]\nTarget Audience: [audience description]";
    }

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 1000,
    });

    const generatedContent = completion.choices[0].message.content;

    // Check if we have content before saving
    if (!generatedContent) {
      throw new Error('No content generated');
    }

    // Save the generated idea to SQLite
    await prisma.idea.create({
      data: {
        content: generatedContent, // Now TypeScript knows this is not null
        type: type === 'enhance' ? 'enhanced' : 'random',
        originalIdea: type === 'enhance' ? prompt : null,
      },
    });

    return NextResponse.json({ result: generatedContent });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
} 