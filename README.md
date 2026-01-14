# OriginalVoices MCP Server

An MCP (Model Context Protocol) server that provides access to [OriginalVoices](https://originalvoices.ai) AI twins for audience research.

## Installation

```bash
npm install @originalvoices/mcp-server
```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ORIGINALVOICES_API_KEY` | Your OriginalVoices API key | Yes |

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "originalvoices": {
      "command": "npx",
      "args": ["@originalvoices/mcp-server"],
      "env": {
        "ORIGINALVOICES_API_KEY": "your-api-key"
      }
    }
  }
}
```

### From Source

```json
{
  "mcpServers": {
    "originalvoices": {
      "command": "node",
      "args": ["/path/to/ov-mcp-server/dist/index.js"],
      "env": {
        "ORIGINALVOICES_API_KEY": "your-api-key"
      }
    }
  }
}
```

## Tools

### ask_twins

Ask questions to a specific audience using OriginalVoices AI twins.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `audience` | string | Description of the audience |
| `questions` | string[] | Array of questions to ask the audience |

**Example:**

```json
{
  "audience": "UK, 18-30, fitness enthusiasts",
  "questions": [
    "When purchasing running shoes, what's most important to you?",
    "How often do you replace your running shoes?"
  ]
}
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev
```

## FAQ

### How do I get an API key?

You can create an API key on the [OriginalVoices Platform](https://platform.originalvoices.ai).

## License

MIT
