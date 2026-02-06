/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { DynamicTool } from '@langchain/core/tools';
import { HumanMessage, AIMessage, ToolMessage, SystemMessage } from '@langchain/core/messages';
import { z } from 'zod';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // 1. Setup Model
    const llm = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash',
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      temperature: 0.7,
    });
    const system = [
      new SystemMessage({
        content: [
          {
            type: 'text',
            text: `You are a helpful research assistant. Answer the user's question based on the search results. 
              CRITICAL: You MUST include citations (links) for every fact you mention in bulletpoints.
              When you reference information, embed the link directly in the text like this: [Source Name](URL).
              The search results provided to you contain the links. Use them.`
          }
        ]
      })
    ];

    // 2. Setup Tool
    const searchTool = new DynamicTool({
      name: 'web_search',
      description: 'Searches the internet for real-time information.',
      // @ts-expect-error params
      parameters: z.object({
        query: z.string().describe('The search query string'),
      }),
      func: async (input: any) => {
        let query = "";

        // Scenario A: Standard Zod naming { query: "..." }
        if (input && typeof input === 'object' && input.query) {
          query = input.query;
        } 
        // Scenario B: LangChain wrapper { input: "..." }  <-- YOUR CASE
        else if (input && typeof input === 'object' && input.input) {
          query = input.input;
        } 
        // Scenario C: Direct string
        else if (typeof input === 'string') {
          query = input;
        } 
        else {
          throw new Error(`Could not determine query from input: ${JSON.stringify(input)}`);
        }
        
        const response = await fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            api_key: process.env.TAVILY_API_KEY,
            query: query,
            search_depth: 'basic',
            max_results: 5,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          console.error('Tavily Error:', errText);
          throw new Error('Tavily API search failed');
        }

        const data = await response.json();
        
        const results = data.results.map((item: any) => 
          `**Source:** [${item.title}](${item.url})\n**Content:** ${item.content}`
        ).join('\n\n');

        return results;
      },
    });

    // 3. Bind Tools
    const modelWithTools = llm.bindTools([searchTool]);

    // 4. Convert Messages
    const history: any[] = messages.map((msg: any) => 
      msg.role === 'user' ? new HumanMessage(msg.content) : new AIMessage(msg.content)
    );

    // 5. The Loop
    let finalAnswer = "";
    const MAX_STEPS = 5;

    for (let i = 0; i < MAX_STEPS; i++) {
      const response = await modelWithTools.invoke([...system, ...history]);
      
      if (!response.tool_calls || response.tool_calls.length === 0) {
        finalAnswer = response.content as string;
        break;
      }

      const toolMessages = await Promise.all(
        response.tool_calls.map(async (call: any) => {
          const toolResult = await searchTool.func(call.args);
          return new ToolMessage(toolResult, call.id);
        })
      );

      history.push(response);
      history.push(...toolMessages);
    }

    return Response.json({ text: finalAnswer });

  } catch (error) {
    console.error('Error in chat route:', error);
    return Response.json({ error: 'Something went wrong' }, { status: 500 });
  }
}