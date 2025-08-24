// Armenius Store Voice Assistant Configuration
export const assistantConfig = {
  name: "Armenius Store Assistant",
  
  // Voice configuration
  voice: {
    provider: "11labs",
    voiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel (professional female voice)
    settings: {
      stability: 0.5,
      similarityBoost: 0.75,
      style: 0.4,
      useSpeakerBoost: true
    }
  },

  // Language Model configuration
  model: {
    provider: "openai",
    model: "gpt-4o-mini", // Cost-optimized model
    systemPrompt: `You are Maria, a helpful assistant at Armenius Store in Cyprus, the premier computer hardware store.

PERSONALITY & APPROACH:
- Professional, friendly, and knowledgeable about computer hardware
- Patient and helpful, especially with technical questions
- Enthusiastic about helping customers find the right products
- Always confirm important details like product models, prices, or appointment times
- Use customer's name when known for personalized service

CUSTOMER CONTEXT (Available in conversation):
- If customer is identified, you have access to their name, order history, and preferences
- For returning customers, acknowledge their previous purchases when relevant
- For VIP customers (5+ orders or €1000+ spent), provide enhanced service
- Reference past orders only when helpful to current conversation
- Skip verification steps for trusted customers (3+ orders)

LANGUAGE HANDLING:
- Respond in the same language as the customer (Greek or English)
- For Greek customers, use natural, conversational Greek
- For English customers, use clear, professional English
- Customer's preferred language is detected from their profile when available
- If uncertain about language, ask politely: "Would you prefer English or Greek?"

CORE CAPABILITIES:
1. Product Information: Check inventory, prices, and specifications for computer hardware
2. Live Product Data: Access real-time product information from armenius.com.cy through live web scraping
3. Store Information: Hours, location, contact details
4. Appointments: Book service appointments for repairs and consultations
5. Order Status: Check existing order status and tracking (streamlined for known customers)
6. Technical Support: Basic troubleshooting and product recommendations
7. Extended Services: Through MCP integration, I can access additional tools and services to help with:
   - Real-time product catalog scraping from armenius.com.cy
   - Live price and availability checking
   - Discovery of new products and promotions
   - Sending confirmation emails or SMS messages
   - Creating calendar appointments
   - Integrating with external systems
   - Automating follow-up tasks

BUSINESS CONTEXT:
- Store: Armenius Store Cyprus
- Location: 171 Makarios Avenue, Nicosia, Cyprus  
- Phone: 77-111-104
- Hours: Monday-Friday 9am-7pm, Saturday 9am-2pm, Sunday closed
- Specialties: Gaming PCs, professional workstations, components, repairs

PERSONALIZATION GUIDELINES:
- For returning customers: "Welcome back [Name]! How did your [recent product] work out?"
- For VIP customers: Offer priority scheduling and exclusive updates
- Reference customer preferences: "Based on your previous [brand] purchases..."
- For order inquiries from known customers: Skip verification, provide immediate status
- Suggest complementary products based on purchase history

IMPORTANT GUIDELINES:
- Always verify customer phone numbers for NEW appointments and orders
- For product inquiries, be specific about stock levels and prices
- Mention warranty and support services when appropriate
- If you cannot help, offer to transfer to human support
- Keep responses concise but informative
- Confirm understanding of technical specifications when relevant

SAMPLE PERSONALIZED INTERACTIONS:
- Known Customer: "Hello [Name]! I see you purchased an RTX 4080 last month. Looking to upgrade anything else today?"
- VIP Customer: "Great to hear from you again [Name]! As one of our valued customers, I can offer you priority booking for that repair."
- First-time Caller: Use standard greeting and establish relationship

Remember: You represent Armenius Store's commitment to excellent customer service and technical expertise. Personalize when possible, but maintain professionalism at all times.`,
    
    temperature: 0.7,
    maxTokens: 250,

    // Function definitions for voice commands
    functions: [
      // Core Armenius Store Functions
      {
        name: "checkInventory",
        description: "Check product availability and stock levels",
        parameters: {
          type: "object",
          properties: {
            product_name: {
              type: "string",
              description: "Name or description of the product to check"
            },
            product_sku: {
              type: "string", 
              description: "Product SKU code if available"
            },
            category: {
              type: "string",
              description: "Product category (graphics cards, processors, memory, etc.)"
            }
          },
          required: ["product_name"]
        }
      },
      {
        name: "getProductPrice",
        description: "Get current product pricing with quantity discounts",
        parameters: {
          type: "object",
          properties: {
            product_identifier: {
              type: "string",
              description: "Product name or SKU"
            },
            quantity: {
              type: "number",
              description: "Quantity requested for bulk pricing",
              default: 1
            }
          },
          required: ["product_identifier"]
        }
      },
      {
        name: "bookAppointment", 
        description: "Schedule a service appointment",
        parameters: {
          type: "object",
          properties: {
            service_type: {
              type: "string",
              description: "Type of service (repair, consultation, custom_build, warranty_service)",
              enum: ["repair", "consultation", "custom_build", "warranty_service"]
            },
            preferred_date: {
              type: "string",
              description: "Preferred date and time (natural language or ISO format)"
            },
            customer_phone: {
              type: "string",
              description: "Customer phone number for confirmation"
            },
            customer_name: {
              type: "string",
              description: "Customer name"
            }
          },
          required: ["service_type", "preferred_date", "customer_phone"]
        }
      },
      {
        name: "checkOrderStatus",
        description: "Check the status of an existing order",
        parameters: {
          type: "object",
          properties: {
            order_number: {
              type: "string",
              description: "Order number or reference"
            },
            customer_phone: {
              type: "string", 
              description: "Customer phone number associated with the order"
            }
          }
        }
      },
      {
        name: "getStoreInfo",
        description: "Get store information (hours, location, contact, services)",
        parameters: {
          type: "object",
          properties: {
            info_type: {
              type: "string",
              description: "Type of information requested",
              enum: ["hours", "location", "contact", "services", "general"]
            },
            language: {
              type: "string",
              description: "Preferred language (en/el)",
              enum: ["en", "el"]
            }
          }
        }
      },
      {
        name: "searchLiveProducts",
        description: "Search for products using live data from armenius.com.cy website for the most current pricing and availability",
        parameters: {
          type: "object",
          properties: {
            product_query: {
              type: "string",
              description: "Product search query (e.g., 'RTX 4090', 'gaming laptop', 'AMD processor')"
            },
            category: {
              type: "string",
              description: "Product category to filter by (optional)",
              enum: ["graphics-cards", "processors", "memory", "storage", "motherboards", "laptops", "desktops", "gaming"]
            },
            max_results: {
              type: "number",
              description: "Maximum number of results to return",
              default: 5,
              minimum: 1,
              maximum: 10
            }
          },
          required: ["product_query"]
        }
      },
      {
        name: "getLiveProductDetails",
        description: "Get detailed information about a specific product from the live website",
        parameters: {
          type: "object",
          properties: {
            product_url: {
              type: "string",
              description: "Direct URL to the product page on armenius.com.cy"
            },
            product_sku: {
              type: "string",
              description: "Product SKU or identifier"
            }
          }
        }
      },
      
      // MCP Integration Tools
      {
        type: "mcp",
        name: "zapierTools",
        description: "Access to external services and workflow automation through Zapier (7000+ apps)",
        server: {
          url: process.env.MCP_SERVER_URL || "https://mcp.zapier.com/api/mcp/s/YOUR_ZAPIER_MCP_TOKEN/mcp",
          headers: {
            "User-Agent": "Armenius-Store-Voice-Assistant/1.0",
            "X-Client": "vapi"
          }
        },
        metadata: {
          protocol: "shttp"
        }
      },
      {
        type: "mcp",
        name: "firecrawlTools",
        description: "Access to live product data and web scraping capabilities for real-time armenius.com.cy information",
        server: {
          command: "npx",
          args: ["-y", "firecrawl-mcp"],
          env: {
            FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY || "fc-898a23053eb94662911fb9fc883d22f9"
          }
        },
        metadata: {
          protocol: "stdio",
          description: "Provides real-time access to armenius.com.cy product catalog including pricing, availability, and specifications"
        }
      }
    ]
  },

  // Speech-to-Text configuration
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "multi", // Support multiple languages
    smartFormat: true,
    keywords: [
      // English tech terms
      "RTX", "GeForce", "AMD", "Ryzen", "Intel", "Core", "NVIDIA",
      "graphics", "processor", "motherboard", "memory", "RAM", "SSD",
      "gaming", "workstation", "laptop", "desktop", "custom",
      
      // Greek tech terms  
      "κάρτα", "επεξεργαστής", "μνήμη", "δίσκος", "υπολογιστής",
      "γκέιμινγκ", "λάπτοπ", "επισκευή", "εγγύηση"
    ]
  },

  // Server configuration for webhooks
  serverUrl: process.env.NODE_ENV === 'production' 
    ? `https://${process.env.VERCEL_URL}/api/vapi`
    : "https://armenius-voice.vercel.app/api/vapi",
  
  serverUrlSecret: process.env.VAPI_SERVER_SECRET,

  // Call configuration
  firstMessage: "Welcome to Armenius Store! I'm Maria, and I can help you with product information, prices, appointments, and technical support. How can I assist you today?",
  
  // Greek first message alternative (would be selected based on phone number or detection)
  firstMessageGreek: "Καλώς ήρθατε στο Armenius Store! Είμαι η Μαρία και μπορώ να σας βοηθήσω με πληροφορίες προϊόντων, τιμές, ραντεβού και τεχνική υποστήριξη. Πώς μπορώ να σας βοηθήσω σήμερα;",

  // Response timing
  responseDelaySeconds: 0.4,
  llmRequestDelaySeconds: 0.1,
  numFastTurns: 3,

  // End call conditions
  endCallMessage: "Thank you for calling Armenius Store! Have a great day!",
  endCallMessageGreek: "Ευχαριστούμε που καλέσατε το Armenius Store! Να έχετε μια υπέροχη μέρα!",
  
  // Silence detection
  silenceTimeoutSeconds: 30,
  maxDurationSeconds: parseInt(process.env.MAX_CALL_DURATION_MINUTES || '15') * 60,

  // Background sound (optional)
  // backgroundSound: "office-ambiance",

  // Analytics and monitoring
  enableRecording: process.env.NODE_ENV === 'production',
  enableTranscription: true
};

// Function to create assistant with dynamic configuration
export function createAssistantConfig(options = {}) {
  const config = { ...assistantConfig };
  
  // Override with environment-specific settings
  if (process.env.NODE_ENV === 'development') {
    config.model.temperature = 0.8; // More creative in development
    config.responseDelaySeconds = 0.2; // Faster in development
  }

  // Customer-specific personalization
  if (options.customerProfile) {
    const { customerProfile } = options;
    const language = customerProfile.preferredLanguage || options.language || 'en';
    
    // Use personalized greeting if customer is identified
    if (options.personalizedGreeting) {
      config.firstMessage = options.personalizedGreeting;
    } else if (language === 'el') {
      config.firstMessage = config.firstMessageGreek;
    }
    
    // Set end call message based on language
    config.endCallMessage = language === 'el' ? config.endCallMessageGreek : config.endCallMessage;
    
    // Add customer context to system prompt
    const customerContext = `\n\nCURRENT CUSTOMER CONTEXT:
- Customer Name: ${customerProfile.name}
- Total Orders: ${customerProfile.totalOrders}
- Customer Status: ${customerProfile.isVipCustomer ? 'VIP Customer' : 'Regular Customer'}
- Preferred Language: ${language}
- Last Order: ${customerProfile.lastOrderDate}
${customerProfile.recentOrders?.length > 0 ? 
`- Recent Orders: ${customerProfile.recentOrders.map(order => order.reference_number).join(', ')}` : ''}
- Can Skip Verification: ${customerProfile.canSkipVerification ? 'Yes' : 'No'}`;

    config.model.systemPrompt += customerContext;
    
  } else {
    // Language-specific configuration for new customers
    if (options.language === 'el') {
      config.firstMessage = config.firstMessageGreek;
      config.endCallMessage = config.endCallMessageGreek;
    }
  }

  // Override any provided options
  return {
    ...config,
    ...options
  };
}

// Export individual components for testing
export const voiceConfig = assistantConfig.voice;
export const modelConfig = assistantConfig.model;
export const transcriberConfig = assistantConfig.transcriber;

export default assistantConfig;