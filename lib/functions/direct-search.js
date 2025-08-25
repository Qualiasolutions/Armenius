// Direct HTTP Search - Fallback when MCP tools aren't available
// Simple HTTP-based product search for armenius.com.cy

// Simple product search using basic HTTP requests
export async function searchArmeniusDirectly(query, maxResults = 3) {
  console.log(`🔍 Direct HTTP search for: "${query}"`);
  
  try {
    // Build search URL for armenius.com.cy
    const encodedQuery = encodeURIComponent(query);
    const searchUrl = `https://armenius.com.cy/search?q=${encodedQuery}`;
    
    console.log(`🌐 Searching URL: ${searchUrl}`);
    
    // Use fetch to get the page
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Armenius-Voice-Assistant/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: 10000
    });
    
    if (!response.ok) {
      console.warn(`⚠️ HTTP ${response.status}: ${response.statusText}`);
      return null;
    }
    
    const html = await response.text();
    console.log(`✅ Retrieved ${html.length} characters of HTML`);
    
    // Parse HTML for product information
    const products = parseProductHTML(html, query, maxResults);
    
    if (products.length > 0) {
      console.log(`🎯 Found ${products.length} products via direct search`);
      return products;
    } else {
      console.log('❌ No products found in HTML parsing');
      return null;
    }
    
  } catch (error) {
    console.error('❌ Direct HTTP search failed:', error.message);
    return null;
  }
}

// Simple HTML parsing for product information
function parseProductHTML(html, originalQuery, maxResults) {
  const products = [];
  
  try {
    // Simple regex patterns to extract product info
    // These patterns are generic and may need adjustment based on armenius.com.cy structure
    
    // Look for product titles in common HTML structures
    const titlePatterns = [
      /<h[1-6][^>]*class="[^"]*product[^"]*"[^>]*>([^<]+)</gi,
      /<div[^>]*class="[^"]*product[^"]*title[^"]*"[^>]*>([^<]+)</gi,
      /<a[^>]*class="[^"]*product[^"]*"[^>]*>([^<]+)</gi,
      /<span[^>]*class="[^"]*product[^"]*name[^"]*"[^>]*>([^<]+)</gi
    ];
    
    // Look for prices
    const pricePatterns = [
      /€\s*([0-9,]+\.?[0-9]*)/gi,
      /([0-9,]+\.?[0-9]*)\s*€/gi,
      /<span[^>]*class="[^"]*price[^"]*"[^>]*>.*?([0-9,]+\.?[0-9]*).*?€.*?</gi
    ];
    
    // Extract product titles
    const foundTitles = [];
    for (const pattern of titlePatterns) {
      let match;
      while ((match = pattern.exec(html)) !== null && foundTitles.length < maxResults * 2) {
        const title = match[1].trim();
        if (title.length > 3 && !foundTitles.includes(title)) {
          foundTitles.push(title);
        }
      }
    }
    
    // Extract prices
    const foundPrices = [];
    for (const pattern of pricePatterns) {
      let match;
      while ((match = pattern.exec(html)) !== null && foundPrices.length < maxResults * 2) {
        const priceStr = match[1].replace(/[^0-9.]/g, '');
        const price = parseFloat(priceStr);
        if (price > 0 && price < 10000) { // Reasonable price range
          foundPrices.push(price);
        }
      }
    }
    
    // Combine titles and prices
    const minItems = Math.min(foundTitles.length, maxResults);
    for (let i = 0; i < minItems; i++) {
      const product = {
        name: foundTitles[i],
        price: foundPrices[i] || null,
        source: 'armenius_direct_http',
        inStock: true, // Assume in stock if found on page
        relevance: calculateSimpleRelevance(foundTitles[i], originalQuery),
        searchMethod: 'direct_http'
      };
      
      products.push(product);
    }
    
    // Sort by relevance
    products.sort((a, b) => b.relevance - a.relevance);
    
    // If we didn't find much, create a simple response
    if (products.length === 0 && (foundTitles.length > 0 || foundPrices.length > 0)) {
      products.push({
        name: `${originalQuery} related products`,
        price: foundPrices[0] || null,
        source: 'armenius_direct_http',
        inStock: true,
        relevance: 0.5,
        searchMethod: 'direct_http',
        note: 'Basic search results - call for details'
      });
    }
    
  } catch (error) {
    console.error('❌ HTML parsing error:', error);
  }
  
  return products.slice(0, maxResults);
}

// Simple relevance calculation
function calculateSimpleRelevance(productTitle, query) {
  const titleLower = productTitle.toLowerCase();
  const queryLower = query.toLowerCase();
  
  // Exact match gets highest score
  if (titleLower.includes(queryLower)) {
    return 1.0;
  }
  
  // Check individual query words
  const queryWords = queryLower.split(/\s+/);
  let matchCount = 0;
  
  for (const word of queryWords) {
    if (word.length > 2 && titleLower.includes(word)) {
      matchCount++;
    }
  }
  
  return matchCount / queryWords.length;
}

// Export for use in other functions
export default {
  searchArmeniusDirectly,
  parseProductHTML,
  calculateSimpleRelevance
};