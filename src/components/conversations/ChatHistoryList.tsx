import React, { useState } from 'react';
import { Pencil, PlusCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns'; // For date formatting

export interface ChatThread {
  id: string;
  title: string;
  lastEdited: Date;
}

interface ChatHistoryListProps {
  threads: ChatThread[];
  onSelectThread: (threadId: string) => void; // Placeholder for selecting a thread
  onUpdateThreadTitle: (threadId: string, newTitle: string) => void; // Handler for title updates
  onStartNewChat: () => void; // Handler for starting a new chat
}

const ChatHistoryList: React.FC<ChatHistoryListProps> = ({ 
  threads, 
  onSelectThread,
  onUpdateThreadTitle,
  onStartNewChat 
}) => {
  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>(''); // State for search term

  // Filter threads based on search term
  const filteredThreads = threads.filter(thread => 
    thread.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (thread: ChatThread) => {
    setEditingThreadId(thread.id);
    setEditingTitle(thread.title);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(e.target.value);
  };

  const handleSaveTitle = (threadId: string) => {
    if (editingTitle.trim()) {
      onUpdateThreadTitle(threadId, editingTitle.trim());
    }
    setEditingThreadId(null);
    setEditingTitle('');
  };

  const handleInputBlur = (threadId: string) => {
    // Save on blur if the title is valid
    handleSaveTitle(threadId);
  };
  
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, threadId: string) => {
    if (e.key === 'Enter') {
      handleSaveTitle(threadId);
    } else if (e.key === 'Escape') {
      setEditingThreadId(null);
      setEditingTitle('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Your chat history</h2>
        <Button 
          variant="default"
          size="sm"
          className="flex items-center gap-1.5"
          onClick={onStartNewChat}
        >
          <PlusCircle className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      <div className="mb-4">
        <Input 
          type="text"
          placeholder="Search chats by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-2"> 
        {filteredThreads.length > 0 ? (
          filteredThreads.map((thread) => (
            <div 
              key={thread.id} 
              className="group flex justify-between items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer border border-gray-200 transition-colors"
              onClick={() => !editingThreadId && onSelectThread(thread.id)} // Select only if not editing
            >
              {editingThreadId === thread.id ? (
                <Input 
                  value={editingTitle}
                  onChange={handleTitleChange}
                  onBlur={() => handleInputBlur(thread.id)}
                  onKeyDown={(e) => handleInputKeyDown(e, thread.id)}
                  autoFocus
                  className="h-8 flex-1 mr-2" // Adjusted styling
                />
              ) : (
                <div className="flex-1 overflow-hidden mr-2"> {/* Added overflow hidden */}
                  <p className="text-sm font-medium text-gray-800 truncate">{thread.title}</p>
                  <p className="text-xs text-gray-500">
                    Last edited: {format(thread.lastEdited, 'PP p')} {/* Example date format */}
                  </p>
                </div>
              )}
              
              {editingThreadId !== thread.id && (
                 <button 
                  onClick={(e) => { 
                    e.stopPropagation(); // Prevent triggering onSelectThread
                    handleEditClick(thread); 
                  }} 
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity p-1"
                  title="Edit title"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              )}
            </div>
          ))
        ) : (
          // Optional: Message when no threads match search
          <p className="text-center text-gray-500 mt-4">No chats found matching your search.</p> 
        )}
      </div>
    </div>
  );
};

export default ChatHistoryList; 