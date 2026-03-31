#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import OriginalVoices from "originalvoices";

const server = new McpServer({
  name: "originalvoices",
  version: "1.0.1",
});

const client = new OriginalVoices({
  apiKey: process.env.ORIGINALVOICES_API_KEY,
});

server.tool(
  "ask_twins",
  "Ask questions to a specific audience using Original Voices AI twins. Use this for ad-hoc audience queries with a free-text audience description.",
  {
    audience: z
      .string()
      .min(1)
      .max(255)
      .describe(
        "The target audience to query. Typically includes demographics such as age range, gender, and location. Examples: 'Women aged 35-55 in the US and UK', 'Gen Z men (18-25) in urban areas'."
      ),
    questions: z
      .array(z.string().min(1).max(2048))
      .min(1)
      .max(15)
      .describe("The questions to ask the Digital Twins. Open-ended questions work best."),
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

server.tool(
  "ask_audience",
  "Ask questions to a previously saved audience by its ID. Use list_projects first to discover projects and their audiences.",
  {
    audienceId: z
      .string()
      .min(1)
      .describe("The audience ID to query. Obtain IDs from list_projects."),
    questions: z
      .array(z.string().min(1).max(2048))
      .min(1)
      .max(15)
      .describe("The questions to ask the Digital Twins. Open-ended questions work best."),
  },
  async ({ audienceId, questions }) => {
    const response = await client.ask.open({
      questions,
      audienceId,
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

server.tool(
  "ask_project",
  "Ask questions to a filtered subset of a project's survey panel. Filters respondents by demographics and survey answers using natural language. Use list_projects first to see available projects.",
  {
    projectId: z
      .string()
      .min(1)
      .describe("The project ID to query. Obtain IDs from list_projects."),
    filter: z
      .string()
      .min(1)
      .max(1024)
      .optional()
      .describe(
        "Optional natural language filter to select respondents. If omitted, all respondents are queried. Examples: 'Samsung users', 'women over 30 who worry about battery'."
      ),
    questions: z
      .array(z.string().min(1).max(2048))
      .min(1)
      .max(15)
      .describe("The questions to ask the Digital Twins. Open-ended questions work best."),
  },
  async ({ projectId, filter, questions }) => {
    const response = await client.ask.project(projectId, {
      questions,
      filter,
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

server.tool(
  "list_projects",
  "List all research projects in the user's organization. Each project contains survey questions and pre-defined audiences. Use this to discover projects before using ask_project or ask_audience.",
  {},
  async () => {
    // SDK projects.list() has a bug (hits /v1/audiences), so use client.get directly
    const response = await client.get<{
      requestId: string;
      data: Array<{
        id: string;
        title: string;
        description: string | null;
        audiences: Array<{ id: string; title: string }>;
      }>;
    }>("/v1/projects");

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
