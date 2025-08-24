// Live Product Search - Real-time access to armenius.com.cy via Firecrawl MCP
// This function provides voice agents with live product data during calls

import { db } from '../supabase/client.js';

export default {
  searchLiveProducts: {
    ttl: 600, // Cache for 10 minutes (live data changes frequently but not every second)
    fallbackResponse: "I'm having trouble accessing the latest product information right now. Let me check our current inventory database instead.",
    cacheable: true,
    
    async execute(parameters, callContext) {
      const { product_query, category, max_results = 5 } = parameters;
      const customerLanguage = callContext.customerProfile?.preferredLanguage || 'en';
      
      console.log(`🔍 Live product search: "${product_query}" (${customerLanguage})`);
      
      try {
        // Step 1: Try to get live data via Firecrawl MCP
        const liveResults = await searchArmeniusLive(product_query, category, max_results);
        
        if (liveResults && liveResults.length > 0) {
          // Success with live data
          const response = formatProductResponse(liveResults, customerLanguage, true);
          
          // Track successful live search
          await db.trackEvent('live_product_search_success', {
            query: product_query,
            results_count: liveResults.length,
            language: customerLanguage,
            source: 'armenius_live'
          }, callContext.conversationId);
          
          return response;
        }
        
        // Step 2: Fallback to database if live search fails
        console.log('⚠️ Live search failed, falling back to database');
        return await fallbackToDatabase(product_query, category, max_results, customerLanguage, callContext);
        
      } catch (error) {
        console.error('❌ Live product search error:', error);
        
        // Track error and fallback to database
        await db.trackEvent('live_product_search_error', {
          query: product_query,
          error: error.message,
          fallback_used: true
        }, callContext.conversationId);
        
        return await fallbackToDatabase(product_query, category, max_results, customerLanguage, callContext);
      }
    }
  },
  
  getLiveProductDetails: {
    ttl: 300, // 5 minutes for specific product details
    fallbackResponse: "I'm having trouble getting the latest details for that product. Let me check our database.",
    cacheable: true,
    
    async execute(parameters, callContext) {
      const { product_url, product_sku } = parameters;
      const customerLanguage = callContext.customerProfile?.preferredLanguage || 'en';
      
      try {
        // Use Firecrawl to get detailed product information
        const productDetails = await scrapeProductDetails(product_url || `https://armenius.com.cy/product/${product_sku}`);
        
        if (productDetails) {
          const response = formatProductDetails(productDetails, customerLanguage);
          
          await db.trackEvent('live_product_details_success', {
            product_sku: product_sku,
            product_url: product_url,
            language: customerLanguage
          }, callContext.conversationId);
          
          return response;
        }
        
        throw new Error('No product details found');
        
      } catch (error) {
        console.error('❌ Product details error:', error);
        
        // Fallback to database product details
        if (product_sku) {
          const dbProduct = await db.searchProducts(product_sku, { limit: 1 });
          if (dbProduct.length > 0) {
            return formatProductDetails(dbProduct[0], customerLanguage, false);
          }
        }
        
        return {
          success: false,
          message: customerLanguage === 'el' 
            ? "Δεν μπόρεσα να βρω τις λεπτομέρειες για αυτό το προϊόν. Μπορείτε να δώσετε περισσότερες πληροφορίες;"
            : "I couldn't find the details for that product. Could you provide more information?"
        };
      }
    }
  }
};

// Search armenius.com.cy live using Firecrawl MCP
async function searchArmeniusLive(query, category, maxResults) {
  try {
    // Check if we have access to MCP tools
    if (!global.mcpTools || !global.mcpTools.firecrawl_search) {
      console.log('⚠️ MCP Firecrawl tools not available, will use scraping');
      return await scrapeProductSearch(query, category, maxResults);
    }
    
    // Use Firecrawl MCP search if available
    const searchResult = await global.mcpTools.firecrawl_search({
      query: `${query} ${category || ''} site:armenius.com.cy`,
      limit: maxResults,
      format: 'markdown'
    });
    
    if (searchResult.success && searchResult.results) {
      return parseSearchResults(searchResult.results, query);
    }
    
    throw new Error('MCP search failed');
    
  } catch (error) {
    console.error('Live search error:', error);
    return null;
  }
}

// Scrape armenius.com.cy search results directly
async function scrapeProductSearch(query, category, maxResults) {
  try {
    if (!global.mcpTools || !global.mcpTools.firecrawl_scrape) {
      throw new Error('Firecrawl MCP not available');
    }
    
    // Build search URL for armenius.com.cy
    const encodedQuery = encodeURIComponent(query);
    const searchUrl = `https://armenius.com.cy/search?q=${encodedQuery}${category ? `&category=${category}` : ''}`;
    
    const scrapeResult = await global.mcpTools.firecrawl_scrape({
      url: searchUrl,
      formats: ['markdown'],
      onlyMainContent: true,
      includeTags: ['.product', '.product-item', 'article'],
      excludeTags: ['nav', 'footer', '.ads'],
      waitFor: 2000,
      timeout: 15000
    });
    
    if (scrapeResult.success && scrapeResult.markdown) {
      return parseProductMarkdown(scrapeResult.markdown, maxResults);
    }
    
    return null;
    
  } catch (error) {
    console.error('Scrape search error:', error);
    return null;
  }
}

// Scrape individual product details
async function scrapeProductDetails(url) {
  try {
    if (!global.mcpTools || !global.mcpTools.firecrawl_scrape) {
      throw new Error('Firecrawl MCP not available');
    }
    
    const scrapeResult = await global.mcpTools.firecrawl_scrape({
      url: url,
      formats: ['markdown'],
      onlyMainContent: true,
      includeTags: ['.product-details', '.product-info', 'main'],
      excludeTags: ['nav', 'footer', '.recommendations'],
      waitFor: 3000,
      timeout: 20000
    });
    
    if (scrapeResult.success && scrapeResult.markdown) {
      return parseProductDetailsMarkdown(scrapeResult.markdown);
    }
    
    return null;
    
  } catch (error) {
    console.error('Product details scrape error:', error);
    return null;
  }
}

// Parse search results from Firecrawl
function parseSearchResults(results, query) {
  const products = [];
  
  for (const result of results) {
    if (result.url && result.url.includes('armenius.com.cy') && result.title && result.content) {
      // Extract product info from search result
      const product = {
        name: result.title,
        url: result.url,
        description: result.content.substring(0, 200) + '...',
        source: 'armenius_live',
        relevance: calculateRelevance(result.title + ' ' + result.content, query)
      };
      
      // Try to extract price from content
      const priceMatch = result.content.match(/€?\s*([0-9,]+\.?[0-9]*)\s*€?/);
      if (priceMatch) {
        product.price = parseFloat(priceMatch[1].replace(/[^0-9.]/g, ''));
      }
      
      products.push(product);
    }
  }
  
  // Sort by relevance and return top results
  return products
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 5);
}

// Parse product information from scraped markdown
function parseProductMarkdown(markdown, maxResults) {
  const products = [];
  
  // Simple markdown parsing for products
  const productBlocks = markdown.split('\n\n').filter(block => 
    block.includes('€') || 
    block.toLowerCase().includes('price') ||
    block.toLowerCase().includes('stock')
  );
  
  for (const block of productBlocks.slice(0, maxResults)) {
    const lines = block.split('\n');
    const product = {
      name: lines[0]?.replace(/[#*_]/g, '').trim(),
      description: lines.slice(1).join(' ').trim(),
      source: 'armenius_scraped'
    };
    
    // Extract price
    const priceMatch = block.match(/€?\s*([0-9,]+\.?[0-9]*)\s*€?/);
    if (priceMatch) {
      product.price = parseFloat(priceMatch[1].replace(/[^0-9.]/g, ''));
    }
    
    // Extract stock info
    if (block.toLowerCase().includes('stock') || block.toLowerCase().includes('available')) {
      product.inStock = !block.toLowerCase().includes('out of stock');
    }
    
    if (product.name && product.name.length > 3) {
      products.push(product);
    }
  }
  
  return products;
}

// Parse detailed product information
function parseProductDetailsMarkdown(markdown) {
  const product = {
    source: 'armenius_live_details'
  };
  
  const lines = markdown.split('\n');
  
  // Extract product name (usually the first heading)
  const titleMatch = lines.find(line => line.match(/^#+\s+(.+)/));
  if (titleMatch) {
    product.name = titleMatch.replace(/^#+\s+/, '').trim();
  }
  
  // Extract price
  const priceMatch = markdown.match(/€?\s*([0-9,]+\.?[0-9]*)\s*€?/);
  if (priceMatch) {
    product.price = parseFloat(priceMatch[1].replace(/[^0-9.]/g, ''));
  }
  
  // Extract specifications
  const specSection = markdown.toLowerCase();
  if (specSection.includes('specification') || specSection.includes('features')) {
    const specStart = specSection.indexOf('specification') || specSection.indexOf('features');
    product.specifications = markdown.substring(specStart, specStart + 500);
  }
  
  // Extract availability
  product.inStock = !markdown.toLowerCase().includes('out of stock') && 
                   !markdown.toLowerCase().includes('unavailable');
  
  return product;
}

// Calculate relevance score for search results
function calculateRelevance(text, query) {
  const textLower = text.toLowerCase();
  const queryWords = query.toLowerCase().split(' ');
  
  let score = 0;
  for (const word of queryWords) {
    if (word.length > 2) {
      const occurrences = (textLower.match(new RegExp(word, 'g')) || []).length;
      score += occurrences * word.length;
    }
  }
  
  return score;
}

// Fallback to database search
async function fallbackToDatabase(query, category, maxResults, language, callContext) {
  try {
    console.log('🔄 Falling back to database search');
    
    const dbResults = await db.searchProducts(query, {
      limit: maxResults,
      category: category
    });
    
    if (dbResults.length > 0) {
      const response = formatProductResponse(dbResults, language, false);
      
      await db.trackEvent('database_fallback_success', {
        query: query,
        results_count: dbResults.length,
        language: language
      }, callContext.conversationId);
      
      return response;
    }
    
    // No results found anywhere
    return {
      success: false,
      message: language === 'el'
        ? `Δεν βρήκα προϊόντα που να ταιριάζουν με "${query}". Μπορείτε να δοκιμάσετε με διαφορετικούς όρους αναζήτησης;`
        : `I couldn't find any products matching "${query}". Could you try different search terms?`,
      suggestions: language === 'el'
        ? ['επεξεργαστές', 'κάρτες γραφικών', 'μνήμες', 'δίσκοι SSD']
        : ['processors', 'graphics cards', 'memory', 'SSD drives']
    };
    
  } catch (error) {
    console.error('Database fallback error:', error);
    
    return {
      success: false,
      message: language === 'el'
        ? "Αντιμετωπίζω προβλήματα με την αναζήτηση προϊόντων. Παρακαλώ δοκιμάστε ξανά σε λίγο."
        : "I'm having trouble searching for products right now. Please try again in a moment."
    };
  }
}

// Format product response for voice
function formatProductResponse(products, language, isLiveData = true) {
  if (!products || products.length === 0) {
    return {
      success: false,
      message: language === 'el'
        ? "Δεν βρήκα προϊόντα για αυτή την αναζήτηση."
        : "I didn't find any products for that search."
    };
  }
  
  const dataSource = isLiveData 
    ? (language === 'el' ? 'από την ιστοσελίδα μας' : 'from our live website')
    : (language === 'el' ? 'από τη βάση δεδομένων μας' : 'from our database');
  
  let message;
  
  if (language === 'el') {
    message = `Βρήκα ${products.length} προϊόντα ${dataSource}:\n\n`;
    
    products.forEach((product, index) => {
      message += `${index + 1}. ${product.name}`;
      if (product.price) {
        message += ` - €${product.price.toFixed(2)}`;
      }
      if (product.inStock === false) {
        message += ' (Εξαντλημένο)';
      } else if (product.inStock === true) {
        message += ' (Διαθέσιμο)';
      }
      message += '\n';
    });
    
    message += '\nΘα θέλατε περισσότερες πληροφορίες για κάποιο από αυτά τα προϊόντα;';
    
  } else {
    message = `I found ${products.length} products ${dataSource}:\n\n`;
    
    products.forEach((product, index) => {
      message += `${index + 1}. ${product.name}`;
      if (product.price) {
        message += ` - €${product.price.toFixed(2)}`;
      }
      if (product.inStock === false) {
        message += ' (Out of Stock)';
      } else if (product.inStock === true) {
        message += ' (In Stock)';
      }
      message += '\n';
    });
    
    message += '\nWould you like more information about any of these products?';
  }
  
  return {
    success: true,
    message: message,
    products: products,
    dataSource: isLiveData ? 'live' : 'database',
    count: products.length
  };
}

// Format detailed product information
function formatProductDetails(product, language, isLiveData = true) {
  const dataSource = isLiveData 
    ? (language === 'el' ? 'από την ιστοσελίδα μας' : 'from our website')
    : (language === 'el' ? 'από τη βάση δεδομένων μας' : 'from our database');
  
  let message;
  
  if (language === 'el') {
    message = `Πληροφορίες ${dataSource} για το ${product.name}:\n\n`;
    
    if (product.price) {
      message += `Τιμή: €${product.price.toFixed(2)}\n`;
    }
    
    if (product.inStock !== undefined) {
      message += `Διαθεσιμότητα: ${product.inStock ? 'Διαθέσιμο' : 'Εξαντλημένο'}\n`;
    }
    
    if (product.description || product.specifications) {
      message += `\nΠεριγραφή: ${product.description || product.specifications}\n`;
    }
    
    message += '\nΘα θέλατε να κλείσετε ραντεβού για περαιτέρω πληροφορίες ή αγορά;';
    
  } else {
    message = `Product information ${dataSource} for ${product.name}:\n\n`;
    
    if (product.price) {
      message += `Price: €${product.price.toFixed(2)}\n`;
    }
    
    if (product.inStock !== undefined) {
      message += `Availability: ${product.inStock ? 'In Stock' : 'Out of Stock'}\n`;
    }
    
    if (product.description || product.specifications) {
      message += `\nDescription: ${product.description || product.specifications}\n`;
    }
    
    message += '\nWould you like to book an appointment for more information or to make a purchase?';
  }
  
  return {
    success: true,
    message: message,
    product: product,
    dataSource: isLiveData ? 'live' : 'database'
  };
}