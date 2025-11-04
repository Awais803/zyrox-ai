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
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const session = createChatSession();
      setChatSession(session);
    } catch (error) {
      console.error("Failed to create chat session:", error);
      setMessages(prev => [...prev, {
        author: MessageAuthor.MODEL,
        content: "Sorry, I couldn't connect to my brain right now. Please check your API key setup and refresh the page."
      }]);
    }
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the chat container when messages update
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (userInput: string) => {
    if (!chatSession || isLoading) {
      return;
    }

    // Play send sound
    (document.getElementById('send-sound') as HTMLAudioElement)?.play().catch(console.error);

    const newUserMessage: Message = { author: MessageAuthor.USER, content: userInput };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const result = await chatSession.sendMessageStream({ message: userInput });
      
      let modelResponse = '';
      let isFirstChunk = true;
      // This will be replaced by the actual message as it streams in
      setMessages(prev => [...prev, { author: MessageAuthor.MODEL, content: '' }]);

      for await (const chunk of result) {
        if (isFirstChunk) {
          // Play receive sound on first chunk
          (document.getElementById('receive-sound') as HTMLAudioElement)?.play().catch(console.error);
          isFirstChunk = false;
        }
        modelResponse += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = modelResponse;
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
       setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          // If the last message is an empty model message, fill it with an error.
          if(lastMessage.author === MessageAuthor.MODEL && lastMessage.content === '') {
            lastMessage.content = "Oops! Something went wrong. I couldn't process that. Please try again.";
          } else { // Otherwise, append a new error message.
             newMessages.push({
                author: MessageAuthor.MODEL,
                content: "Oops! Something went wrong. I couldn't process that. Please try again."
             });
          }
          return newMessages;
       });
    } finally {
      setIsLoading(false);
    }
  };
  
  const isAIResponding = isLoading && messages[messages.length - 1].author === MessageAuthor.MODEL;
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
              isFirst={msg.author === MessageAuthor.MODEL && (index === 0 || messages[index - 1].author !== MessageAuthor.MODEL)} 
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