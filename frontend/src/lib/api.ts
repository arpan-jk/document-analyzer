const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export interface ChatRequest {
  message: string;
  fileName?: string | null;
}

export interface ChatResponse {
  response: string;
  success: boolean;
}

export interface UploadResponse {
  success: boolean;
  message: string;
}

// Dummy responses for when server is not connected
const dummyResponses = {
  greetings: [
    "Hello! I'm your PDF analyzer assistant. How can I help you today?",
    "Hi there! I'm ready to analyze your documents. What would you like to know?",
    "Welcome! I can help you understand and extract information from your PDF documents."
  ],
  analysis: [
    "Based on the document you've uploaded, I can see it contains important information about the topic. Would you like me to provide a summary or answer specific questions?",
    "I've analyzed your PDF and found several key sections. The document appears to be well-structured with clear headings and detailed content.",
    "Your document has been processed successfully. I can help you extract specific information, summarize sections, or answer questions about the content."
  ],
  questions: [
    "That's an interesting question about your document. Based on my analysis, I can provide you with detailed insights on that topic.",
    "I found relevant information in your PDF that addresses your question. Let me break down the key points for you.",
    "Great question! The document contains several sections that relate to your inquiry. Would you like me to elaborate on any specific aspect?"
  ],
  general: [
    "I'm here to help you analyze your PDF documents. Feel free to ask me any questions about the content!",
    "I can assist you with document analysis, summarization, and information extraction. What would you like to know?",
    "Your PDF has been successfully uploaded and processed. I'm ready to help you understand its contents."
  ]
};

const getRandomResponse = (category: keyof typeof dummyResponses): string => {
  const responses = dummyResponses[category];
  return responses[Math.floor(Math.random() * responses.length)];
};



export const api = {
  async uploadFile(file: File): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${BACKEND_URL}/pdf/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.warn('Server not connected, using dummy response:', error);
      
      // Return dummy response when server is not available
      return {
        success: false,
        message: `Successfully uploaded "${file.name}" (dummy response - server not connected)`
      };
    }
  },

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch(`${BACKEND_URL}/pdf/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Chat request failed: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.warn('Server not connected, using dummy response:', error);
      
      // Return dummy response when server is not available
      const message = request.message.toLowerCase();
      let responseCategory: keyof typeof dummyResponses = 'general';
      
      if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        responseCategory = 'greetings';
      } else if (message.includes('analyze') || message.includes('summary') || message.includes('what is this')) {
        responseCategory = 'analysis';
      } else if (message.includes('?') || message.includes('question') || message.includes('how') || message.includes('what') || message.includes('why')) {
        responseCategory = 'questions';
      }
      
      return {
        response: getRandomResponse(responseCategory) + "\n\n*This is a dummy response - the backend server is not connected.*",
        success: true
      };
    }
  },
};