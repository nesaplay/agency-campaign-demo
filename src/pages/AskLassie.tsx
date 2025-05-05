import React, { useState, useEffect, useRef } from "react";
import MainLayout from "@/components/layout/MainLayout";
import MessagesList from "@/components/conversations/interface/MessagesList";
import MessageInput from "@/components/conversations/interface/MessageInput";
import { Message } from "@/components/conversations/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, History } from "lucide-react";
import ChatHistoryList, { ChatThread } from "@/components/conversations/ChatHistoryList";
import { useMutation } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

const LASSIE_ASSISTANT_ID = "88be2a13-70b9-4bfa-ac27-86584e703f84";

const AskLassie = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      content: "Hello! How can I help you today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const assistantMessageRef = useRef<Message | null>(null);

  // Mock chat history state
  const [chatHistory, setChatHistory] = useState<ChatThread[]>([
    { id: "thread-1", title: "Campaign ideas for Summer", lastEdited: new Date(Date.now() - 86400000 * 2) }, // 2 days ago
    { id: "thread-2", title: "Publisher recommendations for CA", lastEdited: new Date(Date.now() - 3600000 * 5) }, // 5 hours ago
    { id: "thread-3", title: "Untitled Chat", lastEdited: new Date() },
  ]);

  // --- TanStack Query Mutation for sending message and handling stream ---
  const streamMutation = useMutation({
    mutationFn: async (userInput: string) => {
      setIsTyping(true);
      assistantMessageRef.current = null;

      // 1. Get Supabase auth token
      const supabase = createClient();
      const session = (await supabase.auth.getSession())?.data?.session;
      console.log(session);
      
      if (!session) throw new Error("Not authenticated");
      const token = session.access_token;

      // 2. Prepare request body
      const requestBody = {
        message: userInput,
        assistantId: LASSIE_ASSISTANT_ID,
        thread_id: currentThreadId,
      };

      // 3. Call the stream API endpoint
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      // 4. Process the stream
      if (!response.body) {
        throw new Error("Response body is null");
      }

      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
      const assistantMsgId = `assistant-${Date.now()}`;
      let accumulatedContent = "";

      setMessages((prev) => [
        ...prev,
        {
          id: assistantMsgId,
          content: "",
          sender: "assistant",
          timestamp: new Date(),
        },
      ]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        accumulatedContent += value;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId ? { ...msg, content: accumulatedContent } : msg
          )
        );
      }
      
      const newThreadIdHeader = response.headers.get('X-Thread-ID');
      if (newThreadIdHeader) {
          console.log("New thread created with ID:", newThreadIdHeader);
          setCurrentThreadId(newThreadIdHeader);
      }

      return accumulatedContent;
    },
    onSuccess: () => {
      console.log("Stream finished successfully.");
      setIsTyping(false);
    },
    onError: (error) => {
      console.error("Streaming mutation error:", error);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          content: `Error: ${error.message}`,
          sender: "assistant",
          timestamp: new Date(),
        },
      ]);
    },
  });
  // --- End Mutation ---

  const handleSendMessage = () => {
    if (!inputValue.trim() || streamMutation.isPending) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = inputValue;
    setInputValue("");

    streamMutation.mutate(messageToSend);
  };

  // Placeholder handlers for MessagesList props
  const handleFeedback = () => console.log("Feedback clicked");
  const handleQuickReply = () => console.log("Quick reply clicked");
  const handlePublisherSelect = () => console.log("Publisher select clicked");
  const handleAddAllPublishers = () => console.log("Add all publishers clicked");
  const handleAddPublisherToCampaign = () => console.log("Add publisher clicked");

  // Placeholder handlers for ChatHistoryList props
  const handleSelectThread = (threadId: string) => {
    console.log("Selected thread:", threadId);
    // Logic to load the selected thread's messages would go here
  };

  const handleUpdateThreadTitle = (threadId: string, newTitle: string) => {
    console.log("Updating thread title:", threadId, newTitle);
    setChatHistory((prev) =>
      prev.map((thread) => (thread.id === threadId ? { ...thread, title: newTitle, lastEdited: new Date() } : thread)),
    );
    // API call to update title on the backend would go here
  };

  const handleStartNewChat = () => {
    console.log("Starting new chat");
    // Logic to clear current messages and start a new session
    setMessages([
      {
        id: "new-initial",
        content: "Starting a fresh chat! How can I assist?",
        sender: "assistant",
        timestamp: new Date(),
      },
    ]);
    // Optionally switch back to the 'ask' tab
    // Consider creating a new thread entry in chatHistory here or upon first message
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)] max-w-[80rem] mx-auto px-4 w-full">
        <Tabs defaultValue="ask" className="flex flex-col h-full">
          <TabsList className="w-full flex justify-start bg-white border-b border-gray-200 p-0 px-4">
            <TabsTrigger
              value="ask"
              className="flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-t-md data-[state=active]:border-empowerlocal-green data-[state=active]:border-b-2 data-[state=active]:text-empowerlocal-green data-[state=inactive]:text-gray-500 bg-transparent whitespace-nowrap"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Ask Lassie</span>
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-t-md data-[state=active]:border-empowerlocal-green data-[state=active]:border-b-2 data-[state=active]:text-empowerlocal-green data-[state=inactive]:text-gray-500 bg-transparent whitespace-nowrap"
            >
              <History className="h-5 w-5" />
              <span>Chat History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="ask"
            className="flex flex-col flex-1 overflow-hidden mt-0 bg-empowerlocal-bg data-[state=inactive]:hidden"
          >
            <div className="flex-1 overflow-y-auto p-4">
              <MessagesList
                messages={messages}
                isTyping={streamMutation.isPending}
                onFeedback={handleFeedback}
                onQuickReply={handleQuickReply}
                onPublisherSelect={handlePublisherSelect}
                onAddAllPublishers={handleAddAllPublishers}
                onAddPublisherToCampaign={handleAddPublisherToCampaign}
              />
            </div>
            <div className="p-4 pt-0">
              <MessageInput
                inputValue={inputValue}
                setInputValue={setInputValue}
                handleSendMessage={handleSendMessage}
              />
            </div>
          </TabsContent>

          <TabsContent
            value="history"
            className="flex flex-col flex-1 overflow-hidden p-4 mt-0 bg-empowerlocal-bg data-[state=inactive]:hidden"
          >
            <ChatHistoryList
              threads={chatHistory}
              onSelectThread={handleSelectThread}
              onUpdateThreadTitle={handleUpdateThreadTitle}
              onStartNewChat={handleStartNewChat}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AskLassie;
