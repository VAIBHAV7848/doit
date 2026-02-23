import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export async function generateSmartRoutine(backlog: any[], logs: any[], timetable: any) {
    const prompt = `
    You are an expert Study Planner AI. Create a highly optimized study routine based on the following data:
    
    1. Weekly Timetable (Fixed classes): ${JSON.stringify(timetable)}
    2. Current Backlog (Topics needing attention): ${JSON.stringify(backlog)}
    3. Recent Study Logs (Previous effort): ${JSON.stringify(logs)}
    
    Current Day: ${new Date().toLocaleDateString(undefined, { weekday: 'long' })}
    
    Rules:
    - Prioritize High-priority backlog items during free blocks.
    - If study logs show low effort in a specific subject, increase its priority.
    - Ensure a balanced routine with breaks.
    - Provide the response in a structured JSON format with 'morningBlock', 'afternoonBlock', and 'eveningBlock'.
    - Each block should have a 'title', 'duration', and 'reasoning'.
  `

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
    })

    return JSON.parse(response.choices[0].message.content || '{}')
}
