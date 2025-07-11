'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Upload, FileText, Bot, User, Download, Eye, EyeOff, X } from 'lucide-react';
import clsx from 'clsx';
import ThemeToggle from '@/components/ThemeToggle';
import ChatMessage from '@/components/ChatMessage';
import LoadingDots from '@/components/LoadingDots';
import { api } from '@/lib/api';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  preview?: string;
}

export default function Home() {
  const [theme, setTheme] = useState('light');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your PDF analyzer assistant. Upload a PDF document and I\'ll help you analyze it. You can ask me questions about the content, extract information, or get summaries.',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const setSessionId = () => {
      let sessionId = localStorage.getItem('session_id');

      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem('session_id', sessionId);
      }
      document.cookie = `session_id=${sessionId};`;
      console.log("session-id: ",sessionId);
  }


  useEffect(() => {
    const root = window.document.documentElement;
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme) {
      setTheme(storedTheme);
      root.classList.add(storedTheme);
    }

    setSessionId();

  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const toggleTheme = () => {
    const root = window.document.documentElement;
    const newTheme = theme === 'light' ? 'dark' : 'light';
    root.classList.remove(theme);
    root.classList.add(newTheme);
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };


  const handleFileDelete = async () => {
    try {

      if (fileInputRef.current) {
       fileInputRef.current.value = '';
      }

      console.log("deleting ",uploadedFile?.name);
      const result = await api.deleteFile(uploadedFile?.name);
      
      if (result.success) {
        const newMessage: Message = {
          id: Date.now().toString(),
          content: result.message || `Successfully Deleted "${uploadedFile?.name}"`,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
      } else {
        throw new Error(result.message || 'Deletion failed');
      }
    } catch (error) {
      console.error('Deletion error:', error);
      alert('Failed to delete file. Please try again.');
    } 
    finally {
       setUploadedFile(null);
    }

  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

   
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    setIsUploading(true);
    
    try {
      const result = await api.uploadFile(file);
      
      if (result.success) {
        setUploadedFile({
          name: file.name,
          size: file.size,
          type: file.type,
          preview: URL.createObjectURL(file)
        });
        
        const newMessage: Message = {
          id: Date.now().toString(),
          content: result.message || `Successfully uploaded "${file.name}". I can now analyze this document for you. Ask me questions about its content!`,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
        setShowPreview(true);
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    let message_to_send = inputMessage;

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const result = await api.sendMessage({
        message: message_to_send,
        fileName: uploadedFile?.name || null
      });
      
      if (result.success) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: result.response,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('Chat request failed');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I\'m having trouble connecting to the server. Please check your connection and try again.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnterPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const shouldShowSplitView = uploadedFile && showPreview;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 dark:bg-blue-500 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">PDF Analyzer</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">AI-Powered Document Analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {uploadedFile && (
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  title={showPreview ? "Hide PDF preview" : "Show PDF preview"}
                >
                  {showPreview ? (
                    <EyeOff className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  )}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {showPreview ? 'Hide' : 'Show'} Preview
                  </span>
                </button>
              )}
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* PDF Preview Panel */}
        {shouldShowSplitView && (
          <div className="w-1/2 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="h-full flex flex-col">
              {/* PDF Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{uploadedFile.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{formatFileSize(uploadedFile.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleFileDelete()}
                    className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    title="Remove file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* PDF Content */}
              <div className="flex-1 p-4 overflow-auto">
                {uploadedFile.preview ? (
                  <div className="w-full h-full">
                    <iframe
                      src={uploadedFile.preview}
                      className="w-full h-full border border-gray-200 dark:border-gray-600 rounded-lg"
                      title="PDF Preview"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">PDF preview not available</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                        The document has been uploaded successfully and is ready for analysis.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Chat Panel */}
        <div className={clsx(
          "flex flex-col bg-white dark:bg-gray-800",
          shouldShowSplitView ? "w-1/2" : "w-full"
        )}>
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 p-2 bg-blue-600 dark:bg-blue-500 rounded-full">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md p-4">
                  <LoadingDots />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-end space-x-3">
              {/* File Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex-shrink-0 mb-3 p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
                title="Upload PDF"
              >
                {isUploading ? (
                  <div className="w-5 h-5 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Upload className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Message Input */}
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyUp={handleEnterPress}
                  placeholder="Ask me about your PDF document..."
                  className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  rows={1}
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
              </div>

              {/* Send Button */}
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="flex-shrink-0 mb-3 p-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Send message"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
