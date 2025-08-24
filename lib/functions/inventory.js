import { db } from '../supabase/client.js';

// Helper function to detect language
function detectLanguage(text) {
  // Simple Greek detection - look for Greek characters
  const greekRegex = /[\u0370-\u03FF\u1F00-\u1FFF]/;
  return greekRegex.test(text) ? 'el' : 'en';
}

// Helper function to normalize search terms
function normalizeSearchTerm(term) {
  return term
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Helper function for product suggestions
async function getSimilarProducts(searchTerm, limit = 3) {
  try {
    // Try category-based suggestions first
    const products = await db.searchProducts(searchTerm, limit + 5);
    
    if (products.length === 0) {
      // Fallback to popular products
      const { data } = await db.supabase
        .from('products')
        .select('name, price, stock_quantity')
        .gt('stock_quantity', 0)
        .order('stock_quantity', { ascending: false })
        .limit(limit);
      
      return data || [];
    }

    return products.slice(0, limit);
  } catch (error) {
    console.error('Error getting similar products:', error);
    return [];
  }
}

const inventoryFunctions = {
  checkInventory: {
    ttl: 300, // Cache for 5 minutes
    fallbackResponse: "I'm having trouble checking our inventory right now. Please call us directly at 77-111-104 for current stock information.",
    
    async execute(params, context) {
      const { product_name, product_sku, category } = params;
      const searchTerm = product_name || product_sku;
      
      if (!searchTerm) {
        return {
          available: false,
          message: "I need a product name or SKU to check inventory. What product are you looking for?",
          requiresInput: true
        };
      }

      const language = detectLanguage(searchTerm);
      const normalizedTerm = normalizeSearchTerm(searchTerm);

      try {
        // First try exact SKU match
        if (product_sku) {
          const product = await db.getProductBySkuOrName(product_sku);
          if (product) {
            if (product.stock_quantity > 0) {
              return {
                available: true,
                message: language === 'el' 
                  ? `Ναι! ${product.name} είναι διαθέσιμο. Έχουμε ${product.stock_quantity} μονάδες στη τιμή των €${product.price}. Θα θέλατε να σας κρατήσω ένα;`
                  : `Yes! ${product.name} is in stock. We have ${product.stock_quantity} units available at €${product.price}. Would you like me to reserve one for you?`,
                product: {
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  stock: product.stock_quantity,
                  sku: product.sku
                }
              };
            } else {
              const suggestions = await getSimilarProducts(normalizedTerm);
              return {
                available: false,
                message: language === 'el'
                  ? `Δυστυχώς το ${product.name} δεν είναι διαθέσιμο αυτή τη στιγμή. Θα θέλατε να δείτε παρόμοια προϊόντα;`
                  : `Unfortunately ${product.name} is currently out of stock. Would you like me to check similar products?`,
                product: product,
                suggestions: suggestions
              };
            }
          }
        }

        // Try fuzzy search on name/brand/category
        const products = await db.searchProducts(normalizedTerm, 5);
        
        if (products.length === 0) {
          const suggestions = await getSimilarProducts(normalizedTerm);
          return {
            available: false,
            message: language === 'el'
              ? `Δε μπόρεσα να βρω το "${searchTerm}" στο απόθεμά μας. Θα θέλατε να δείτε τα παρόμοια προϊόντα που έχουμε;`
              : `I couldn't find "${searchTerm}" in our inventory. Would you like me to check similar products we have in stock?`,
            searchTerm: searchTerm,
            suggestions: suggestions
          };
        }

        if (products.length === 1) {
          const product = products[0];
          return {
            available: true,
            message: language === 'el'
              ? `Ναι! ${product.name} είναι διαθέσιμο. Έχουμε ${product.stock_quantity} μονάδες στη τιμή των €${product.price}. Θα θέλατε να σας κρατήσω ένα;`
              : `Yes! ${product.name} is in stock. We have ${product.stock_quantity} units available at €${product.price}. Would you like me to reserve one for you?`,
            product: {
              id: product.id,
              name: product.name,
              price: product.price,
              stock: product.stock_quantity,
              sku: product.sku,
              specifications: product.specifications
            }
          };
        }

        // Multiple matches - let customer choose
        const productList = products.map((p, index) => 
          `${index + 1}. ${p.name} - €${p.price} (${p.stock_quantity} in stock)`
        ).join('\n');

        return {
          available: true,
          multipleMatches: true,
          message: language === 'el'
            ? `Βρήκα ${products.length} προϊόντα που ταιριάζουν με "${searchTerm}". Ποιο σας ενδιαφέρει;\n${productList}`
            : `I found ${products.length} products matching "${searchTerm}". Which one interests you?\n${productList}`,
          products: products.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            stock: p.stock_quantity,
            sku: p.sku
          }))
        };

      } catch (error) {
        console.error('Inventory check error:', error);
        throw error;
      }
    }
  },

  getProductPrice: {
    ttl: 180, // Cache for 3 minutes (prices change more frequently)
    fallbackResponse: "I'm having trouble accessing our current pricing. Please call us at 77-111-104 for the latest prices.",
    
    async execute(params, context) {
      const { product_identifier, quantity = 1 } = params;
      
      if (!product_identifier) {
        return {
          error: true,
          message: "I need a product name or SKU to check pricing. What product are you interested in?",
          requiresInput: true
        };
      }

      const language = detectLanguage(product_identifier);

      try {
        // Search for product
        const products = await db.searchProducts(product_identifier, 3);
        
        if (products.length === 0) {
          return {
            found: false,
            message: language === 'el'
              ? `Δε μπόρεσα να βρω το "${product_identifier}" στον κατάλογό μας. Μπορείτε να δώσετε περισσότερες λεπτομέρειες;`
              : `I couldn't find "${product_identifier}" in our catalog. Can you provide more details?`,
            searchTerm: product_identifier
          };
        }

        if (products.length === 1) {
          const product = products[0];
          let price = parseFloat(product.price);
          let discount = 0;
          let discountMessage = '';

          // Apply quantity discounts
          if (quantity >= 10) {
            discount = 0.1; // 10% discount for 10+ items
            discountMessage = language === 'el' 
              ? ' (10% έκπτωση για 10+ τεμάχια)'
              : ' (10% discount for 10+ items)';
          } else if (quantity >= 5) {
            discount = 0.05; // 5% discount for 5+ items
            discountMessage = language === 'el'
              ? ' (5% έκπτωση για 5+ τεμάχια)'
              : ' (5% discount for 5+ items)';
          }

          const unitPrice = price * (1 - discount);
          const totalPrice = unitPrice * quantity;

          return {
            found: true,
            product: {
              name: product.name,
              sku: product.sku,
              unitPrice: unitPrice.toFixed(2),
              quantity: quantity,
              totalPrice: totalPrice.toFixed(2),
              discount: discount,
              stock: product.stock_quantity
            },
            message: language === 'el'
              ? `${product.name} κοστίζει €${unitPrice.toFixed(2)} το τεμάχιο${discountMessage}. Για ${quantity} τεμάχια, το συνολικό κόστος είναι €${totalPrice.toFixed(2)}. Έχουμε ${product.stock_quantity} σε απόθεμα.`
              : `${product.name} costs €${unitPrice.toFixed(2)} each${discountMessage}. For ${quantity} units, the total would be €${totalPrice.toFixed(2)}. We have ${product.stock_quantity} in stock.`
          };
        }

        // Multiple matches
        const productList = products.slice(0, 3).map((p, index) => 
          `${index + 1}. ${p.name} - €${p.price}`
        ).join('\n');

        return {
          found: true,
          multipleMatches: true,
          message: language === 'el'
            ? `Βρήκα πολλαπλά προϊόντα. Ποιο σας ενδιαφέρει;\n${productList}`
            : `I found multiple products. Which one interests you?\n${productList}`,
          products: products.slice(0, 3)
        };

      } catch (error) {
        console.error('Price check error:', error);
        throw error;
      }
    }
  }
};

export default inventoryFunctions;