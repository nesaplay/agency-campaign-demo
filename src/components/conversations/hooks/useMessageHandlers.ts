import { useToast } from "@/hooks/use-toast";
import { Message as MessageType, QuickReply } from "../types";
import { Publisher } from "@/components/network/types";

interface UseMessageHandlersProps {
  messages: MessageType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  setCampaignStage: React.Dispatch<React.SetStateAction<number>>;
  selectedPublishers: Publisher[];
  setSelectedPublishers: React.Dispatch<React.SetStateAction<Publisher[]>>;
  setCampaignDetails: React.Dispatch<
    React.SetStateAction<{
      budget: string;
      geography: string;
      timeline: string;
      estimatedReach: string;
    }>
  >;
  setShowSummaryPanel: React.Dispatch<React.SetStateAction<boolean>>;
  publishers: Publisher[];
  onPublisherSelect?: (publisher: Publisher) => void;
}

// Define an explicit type for a step in the config
interface StepConfig {
  id: string;
  triggers: string[];
  action: () => MessageType | null; // Action function type
  quickReplies?: QuickReply[]; // Optional quick replies
  // Add other potential optional step properties here if needed
}

export const useMessageHandlers = ({
  messages,
  setMessages,
  inputValue,
  setInputValue,
  isTyping,
  setIsTyping,
  setCampaignStage,
  selectedPublishers,
  setSelectedPublishers,
  setCampaignDetails,
  setShowSummaryPanel,
  publishers,
  onPublisherSelect,
}: UseMessageHandlersProps) => {
  const { toast } = useToast();

  const handlePublisherSelect = (publisherId: string) => {
    const publisher = publishers.find((p) => p.id === publisherId);
    if (publisher) {
      if (onPublisherSelect) {
        onPublisherSelect(publisher);
      } else {
        setSelectedPublishers((prev) => [...prev.filter((p) => p.id !== publisherId), publisher]);
        toast({
          title: "Publisher details",
          description: "Viewing detailed publisher information",
        });
      }
    }
  };

  const handleAddPublisherToCampaign = (publisherId: string) => {
    const publisher = publishers.find((p) => p.id === publisherId);
    if (publisher) {
      const isAlreadySelected = selectedPublishers.some((p) => p.id === publisherId);
      if (!isAlreadySelected) {
        setSelectedPublishers((prev) => [...prev, publisher]);
        toast({
          title: "Publisher Added",
          description: `${publisher.name} has been added to your campaign summary.`,
        });
        setShowSummaryPanel(true);
      } else {
        toast({
          title: "Already Added",
          description: `${publisher.name} is already in your campaign summary.`,
          variant: "default",
        });
      }
    }
  };

  const handleAddAllPublishers = () => {
    const newPublishers = publishers.filter((p) => !selectedPublishers.some((sp) => sp.id === p.id));
    if (newPublishers.length > 0) {
      setSelectedPublishers((prev) => [...prev, ...newPublishers]);
      setShowSummaryPanel(true);
    }
  };

  // Use the explicit type for the config array
  const stepsConfig: StepConfig[] = [
    {
      id: 'start_campaign',
      triggers: ["Start a new campaign", "new campaign"],
      action: (): MessageType => { // Action can return MessageType directly if never null
        setCampaignStage(1);
        return { 
          id: Date.now().toString(),
          content: "Great! Let's clarify your campaign budget and goals. What's your budget range for this campaign?",
          sender: "assistant",
          timestamp: new Date(),
          quickReplies: [ // This step has quickReplies
             { id: "3", text: "Under $10,000", value: "budget-small" },
             { id: "4", text: "$10,000 - $50,000", value: "budget-medium" },
             { id: "5", text: "Over $50,000", value: "budget-large" },
           ],
        };
      }
    },
    {
      id: 'set_budget',
      triggers: ["$10,000", "budget"],
      action: (): MessageType => {
        setCampaignDetails((prev) => ({ ...prev, budget: "$10,000 - $50,000" }));
        setCampaignStage(2);
        return {
          id: Date.now().toString(),
          content: "Thank you for sharing your budget. Which geographic areas would you like to focus on for your Dr. Bombay ice cream summer campaign?",
          sender: "assistant",
          timestamp: new Date(),
          quickReplies: [
            { id: "6", text: "West Coast (CA, AZ, NV)", value: "west" },
            { id: "7", text: "East Coast", value: "east" },
            { id: "8", text: "Nationwide", value: "nationwide" },
          ],
        };
      }
    },
    {
      id: 'set_geography',
      triggers: ["West Coast", "geographic"],
       action: (): null => { // This action returns null, but the type allows MessageType | null
          setCampaignDetails((prev) => ({ ...prev, geography: "West Coast (CA, AZ, NV)" }));
          setCampaignStage(3);

          const mapResponse: MessageType = {
            id: Date.now().toString(),
            content: "The West Coast is a great choice for a summer ice cream campaign! Here's our publisher coverage in these areas:",
            sender: "assistant",
            timestamp: new Date(),
            showMap: true,
            publishers: publishers,
          };
          setMessages((prev) => [...prev, mapResponse]);
          setIsTyping(false);

          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setCampaignDetails((prev) => ({
                ...prev,
                timeline: "June 15 - August 30",
                estimatedReach: "1.97M",
              }));

              const recommendationsResponse: MessageType = {
                id: (Date.now() + 1).toString(),
                content: "Based on your budget and geographic focus, I recommend these top-performing publishers for your summer ice cream campaign:",
                sender: "assistant",
                timestamp: new Date(),
                publishers: publishers,
                showAddPublisherButton: true,
                quickReplies: [
                  { id: '9', text: 'Add all three', value: 'add-all' },
                  { id: '10', text: 'See other options', value: 'more-options' },
                  { id: '11', text: 'View campaign summary', value: 'view-summary' }
                ]
              };
              setMessages((prev) => [...prev, recommendationsResponse]);
              setIsTyping(false);

              setTimeout(() => {
                setShowSummaryPanel(true);
              }, 500);
            }, 1500);
          }, 2000);

          return null;
        }
    },
    {
      id: 'add_all',
      triggers: ["Add all three", "add all"],
      action: (): MessageType => {
        handleAddAllPublishers();
        setCampaignStage(4);
        return {
          id: Date.now().toString(),
          content: "Great! I've added all three publishers to your campaign. Would you like to review your campaign summary or proceed to the next step?",
          sender: "assistant",
          timestamp: new Date(),
          quickReplies: [
            { id: "12", text: "Review summary", value: "review-summary" },
            { id: "13", text: "Proceed to creative options", value: "creative" },
          ],
        };
      }
    },
    {
      id: 'view_summary',
      triggers: ["View campaign summary", "Review summary"],
      action: (): MessageType => {
        setShowSummaryPanel(true);
        return {
          id: Date.now().toString(),
          content: "Here's your campaign summary. You can continue to refine it or proceed to the next step when you're ready.",
          sender: "assistant",
          timestamp: new Date(),
          quickReplies: [
            { id: "14", text: "Proceed to creative options", value: "creative" },
            { id: "15", text: "Adjust publisher selection", value: "adjust" },
          ],
        };
      }
    },
  ];

  const handleSendMessage = (content: string = inputValue) => {
    if (!content.trim()) return;

    const userMessage: MessageType = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    let response: MessageType | null = null;
    let stepMatched = false;

    for (const step of stepsConfig) {
      const lowerContent = content.toLowerCase();
      if (step.triggers.some(trigger => lowerContent.includes(trigger.toLowerCase()))) {
        response = step.action();
        stepMatched = true;
        break;
      }
    }

    setTimeout(() => {
      if (!stepMatched) {
        response = {
          id: (Date.now() + 1).toString(),
          content: "I understand you're interested in creating a campaign for Dr. Bombay ice cream. Could you tell me more about your specific needs?",
          sender: "assistant",
          timestamp: new Date(),
        };
      }

      if (response) {
        setMessages((prev) => [...prev, response as MessageType]);
        setIsTyping(false);
      } else if (!stepMatched) {
        setIsTyping(false);
      }
    }, 1000);
  };

  const handleQuickReply = (text: string, value: string) => {
    handleSendMessage(text);
  };

  const handleFeedback = (messageId: string, isPositive: boolean) => {
    console.log(`Feedback for message ${messageId}: ${isPositive ? "positive" : "negative"}`);
    toast({
      title: isPositive ? "Thanks for your feedback" : "We'll improve this response",
      description: isPositive
        ? "Your feedback helps us improve Lassie"
        : "We'll use your feedback to make Lassie better",
    });
  };

  return {
    handlePublisherSelect,
    handleAddPublisherToCampaign,
    handleAddAllPublishers,
    handleSendMessage,
    handleQuickReply,
    handleFeedback,
    stepsConfig,
  };
};
