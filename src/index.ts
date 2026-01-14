#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import OriginalVoices from "originalvoices";

const server = new McpServer({
  name: "originalvoices",
  version: "1.0.0",
});

const client = new OriginalVoices({
  apiKey: process.env.ORIGINALVOICES_API_KEY,
});

server.tool(
  "ask_twins",
  "Ask questions to a specific audience using Original Voices AI twins",
  {
    audience: z.string().describe("Description of the audience"),
    questions: z.array(z.string()).describe("Array of questions to ask the audience"),
  },
  async ({ audience, questions }) => {
    const response = await client.ask.open({
      questions,
      audiencePrompt: audience,
    });

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(response.data, null, 2),
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
