import bwipjs from "bwip-js";
import { randomBytes } from "crypto";

export const generate = async () => {
  try {
    // Generate cryptographically secure random string
    const randomString = randomBytes(8).toString("hex").toUpperCase(); // 16 chars

    // Generate barcode buffer
    const pngBuffer = await bwipjs.toBuffer({
      bcid: "code128",
      text: randomString,
      scale: 2,
      height: 10,
      includetext: false,
    });

    // Convert to URL-safe base64
    return pngBuffer
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "")
      .substring(0, 30);
  } catch (error) {
    // Fallback with timestamp entropy
    return `BC-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 6)}`
      .toUpperCase()
      .slice(0, 30);
  }
};
export default generate;
