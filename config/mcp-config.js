// MCP (Model Context Protocol) Configuration for Armenius Store Voice Assistant
// This file handles MCP server setup and integration testing

export const mcpConfig = {
  // Default MCP server configuration
  defaultServer: {
    url: process.env.MCP_SERVER_URL || "https://mcp.zapier.com/api/mcp/s/YOUR_ZAPIER_MCP_TOKEN/mcp",
    protocol: "shttp", // Streamable HTTP for better performance
    headers: {
      "User-Agent": "Armenius-Store-Voice-Assistant/1.0",
      "X-Client": "vapi",
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    timeout: 30000, // 30 second timeout
    retryAttempts: 3
  },

  // Available MCP server types and their configurations
  serverTypes: {
    zapier: {
      name: "Zapier MCP",
      description: "Access to 7000+ apps and 30000+ actions through Zapier",
      baseUrl: "https://mcp.zapier.com/api/mcp/s/",
      capabilities: [
        "email_notifications",
        "sms_messaging", 
        "calendar_integration",
        "crm_integration",
        "task_automation",
        "data_sync"
      ]
    },
    composio: {
      name: "Composio MCP",
      description: "Specific tool integrations (Gmail, GitHub, etc.)",
      baseUrl: "https://mcp.composio.dev/api/mcp/",
      capabilities: [
        "gmail_integration",
        "github_operations",
        "slack_messaging",
        "calendar_management"
      ]
    }
  },

  // Common MCP tools that might be available for Armenius Store
  expectedTools: {
    // Customer Communication
    "send_email": {
      description: "Send confirmation emails to customers",
      useCases: ["appointment confirmations", "order confirmations", "follow-ups"]
    },
    "send_sms": {
      description: "Send SMS notifications to customers", 
      useCases: ["appointment reminders", "order updates", "urgent notifications"]
    },
    
    // Calendar Integration
    "create_calendar_event": {
      description: "Create calendar events for appointments",
      useCases: ["service appointments", "delivery schedules", "staff meetings"]
    },
    
    // CRM Integration
    "update_customer_record": {
      description: "Update customer information in CRM",
      useCases: ["contact updates", "purchase history", "service records"]
    },
    
    // Task Management
    "create_task": {
      description: "Create follow-up tasks for staff",
      useCases: ["order processing", "service follow-ups", "inventory checks"]
    }
  }
};

// MCP Server Connection Test
export async function testMcpConnection(serverUrl) {
  const testConfig = {
    ...mcpConfig.defaultServer,
    url: serverUrl
  };

  try {
    console.log(`Testing MCP connection to: ${serverUrl}`);
    
    // Test basic connectivity (this would be implemented with actual HTTP client)
    const response = await fetch(serverUrl, {
      method: 'POST',
      headers: testConfig.headers,
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "tools/list",
        id: 1
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log("✅ MCP Connection successful");
    console.log(`Available tools: ${data.result?.tools?.length || 0}`);
    
    return {
      success: true,
      tools: data.result?.tools || [],
      capabilities: data.result?.capabilities || []
    };

  } catch (error) {
    console.error("❌ MCP Connection failed:", error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Validate MCP tool configuration
export function validateMcpTool(toolConfig) {
  const requiredFields = ['type', 'name', 'server'];
  const missingFields = requiredFields.filter(field => !toolConfig[field]);
  
  if (missingFields.length > 0) {
    return {
      valid: false,
      errors: [`Missing required fields: ${missingFields.join(', ')}`]
    };
  }

  if (toolConfig.type !== 'mcp') {
    return {
      valid: false,
      errors: ['Tool type must be "mcp"']
    };
  }

  if (!toolConfig.server.url) {
    return {
      valid: false,
      errors: ['Server URL is required']
    };
  }

  // Validate URL format
  try {
    new URL(toolConfig.server.url);
  } catch (error) {
    return {
      valid: false,
      errors: ['Server URL is not a valid URL']
    };
  }

  return {
    valid: true,
    errors: []
  };
}

// Generate MCP tool configuration for Vapi
export function generateMcpToolConfig(serverUrl, options = {}) {
  const config = {
    type: "mcp",
    name: options.name || "mcpTools",
    description: options.description || "Access to extended capabilities through MCP server integration",
    server: {
      url: serverUrl,
      headers: {
        ...mcpConfig.defaultServer.headers,
        ...options.headers
      }
    },
    metadata: {
      protocol: options.protocol || "shttp",
      ...options.metadata
    }
  };

  return config;
}

export default mcpConfig;