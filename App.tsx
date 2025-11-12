import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '@google/genai';
import { createChatSession } from './geminiService';
import Header from './components/Header';
import ChatBubble from './components/ChatBubble';
import TypingIndicator from './components/TypingIndicator';
import InputBar from './components/InputBar';
import { Message, MessageAuthor } from './types';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      author: MessageAuthor.MODEL,
      content: "System online. I am Zyrox, your guide through the digital cosmos. What mysteries can we solve together?",
    }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom of the chat container when messages update
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (userInput: string) => {
    if (isLoading) {
      return;
    }

    // Initialize chat session on first message
    if (!chatSessionRef.current) {
      try {
        chatSessionRef.current = createChatSession();
      } catch (error) {
        console.error("Failed to create chat session:", error);
        let errorMessage = "Sorry, I couldn't connect to my brain right now. Please check your API key setup and refresh the page.";
        if (error instanceof Error && error.message.includes("API key not found")) {
            errorMessage = "It seems the Gemini API key is missing. Please ensure it's configured correctly in your project's secrets or environment variables, then refresh the page and try again.";
        }
        setMessages(prev => [...prev, {
          author: MessageAuthor.MODEL,
          content: errorMessage
        }]);
        return;
      }
    }
    const chatSession = chatSessionRef.current;

    // Play send sound
    (document.getElementById('send-sound') as HTMLAudioElement)?.play().catch(console.error);

    const newUserMessage: Message = { author: MessageAuthor.USER, content: userInput };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const result = await chatSession.sendMessageStream({ message: userInput });
      
      let modelResponse = '';
      let isFirstChunk = true;
      // Add a placeholder for the streaming response
      setMessages(prev => [...prev, { author: MessageAuthor.MODEL, content: '' }]);

      for await (const chunk of result) {
        if (isFirstChunk) {
          // Play receive sound on first chunk
          (document.getElementById('receive-sound') as HTMLAudioElement)?.play().catch(console.error);
          isFirstChunk = false;
        }
        modelResponse += chunk.text;
        // Update the last message content immutably
        setMessages(prev => prev.map((msg, index) => 
            index === prev.length - 1
            ? { ...msg, content: modelResponse }
            : msg
        ));
      }
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      const errorMessage = "Oops! Something went wrong. I couldn't process that. Please try again.";
       setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          // If the last message is the empty placeholder, update it with the error.
          if (lastMessage && lastMessage.author === MessageAuthor.MODEL && lastMessage.content === '') {
            return prev.map((msg, index) =>
              index === prev.length - 1
              ? { ...msg, content: errorMessage }
              : msg
            );
          } else { // Otherwise, append a new error message.
             return [...prev, { author: MessageAuthor.MODEL, content: errorMessage }];
          }
       });
    } finally {
      setIsLoading(false);
    }
  };
  
  const isAIResponding = isLoading && messages.length > 0 && messages[messages.length - 1]?.author === MessageAuthor.MODEL;
  const showTypingIndicator = isLoading && !isAIResponding;

  return (
    <div className="flex flex-col h-screen bg-transparent">
      <Header />
      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6" style={{ scrollbarGutter: 'stable both-edges' }}>
        <div className="container mx-auto flex flex-col space-y-4 pb-4">
          {messages.map((msg, index) => (
            <ChatBubble 
              key={index} 
              message={msg} 
              isFirst={msg.author === MessageAuthor.MODEL && (index === 0 || messages[index - 1]?.author !== MessageAuthor.MODEL)} 
              isStreaming={isAIResponding && index === messages.length - 1}
            />
          ))}
          {showTypingIndicator && <TypingIndicator />}
        </div>
      </main>
      <InputBar onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default App;