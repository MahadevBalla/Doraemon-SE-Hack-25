import pkg from 'code-128-encoder';
const { encode } = pkg;

export const generate = (productName) => {
    // Generate unique base string
    const baseString = `${productName
        .replace(/\s+/g, '')       // Remove spaces
        .slice(0, 20)}-${Date.now().toString().slice(-6)}`;  // Add timestamp
    
    // Generate valid Code128 string
    try {
        return encode(baseString, 'C');  // 'C' mode for optimal numeric compression
    } catch (error) {
        // Fallback to simple hash if encoding fails
        const fallback = `BC-${Math.random().toString(36).slice(2, 10)}`;
        return encode(fallback, 'C');
    }
};

export default generate;