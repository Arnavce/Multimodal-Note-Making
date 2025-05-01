import axios from 'axios';

/**
 * Generate hashtags from a given note text using Google Gemini API.
 * @param noteText The content of the note as a string.
 * @param maxHashtags Optional: Limit the number of hashtags returned.
 * @returns Array of hashtags like ['#AI', '#machinelearning', ...]
 */
export async function generateHashtags(noteText: string, maxHashtags: number = 10): Promise<string[]> {
  const apiKey = 'Hehehe';  // Replace with your actual Gemini API Key
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  
  // Create a specific prompt asking for hashtags
  const prompt = `Generate ${maxHashtags} relevant hashtags for the following text. Return only the hashtags separated by spaces, without any additional text or explanations:\n\n${noteText}`;
  
  // Constructing the data to send
  const requestData = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }]
  };
  
  try {
    // Sending the request to Gemini API
    const response = await axios.post(url, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Extracting generated content from the API response
    // The correct path to access the generated text in Gemini's response
    const generatedText = response.data.candidates[0]?.content?.parts[0]?.text || '';
    
    // Extract hashtags - look for words starting with # or add # if needed
    const hashtags: string[] = generatedText
      .split(/\s+/)
      .filter((word: string) => word && word.length > 0) // Filter out empty strings
      .map((word: string) => word.startsWith('#') ? word : `#${word}`)
      .slice(0, maxHashtags);
    
    return hashtags;
  } catch (error) {
    console.error('Error generating hashtags:', error);
    return [];
  }
}
