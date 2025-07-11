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

export const api = {
  async uploadFile(file: File): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${BACKEND_URL}/pdf/upload`, {
        method: 'POST',
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Server not connected:', error);
      return {success : false,message : "File not uploaded, server error."}
    }
  },

   async deleteFile(filename : string | undefined): Promise<UploadResponse> {
    try {

      const response = await fetch(`${BACKEND_URL}/pdf/upload`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Deletion failed: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      console.error('Server not connected:', error);
      return {success : false,message : "File not deleted.Server error"}
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
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Chat request failed: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.warn('Server not connected : ', error);
      return {success : false,response : "Server error."}
    }
  }
}