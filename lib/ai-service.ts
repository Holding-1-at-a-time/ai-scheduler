export class AIService {
  private model: string = "llama2:3.1-8b";

  async generateResponse(prompt: string): Promise<string> {
    const response = await fetch('/api/ollama', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, model: this.model }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.output;
  }
}