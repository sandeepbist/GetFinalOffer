import "pdf-parse/worker";
import { PDFParse } from "pdf-parse";

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();

    const cleanText = result.text.replace(/\n\s*\n/g, "\n").trim();

    return cleanText;
  } catch (error) {
    console.error("PDF Parse Error:", error);
    throw new Error("Failed to parse PDF text");
  } finally {
    await parser.destroy();
  }
}
