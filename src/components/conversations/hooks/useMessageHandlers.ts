import { useToast } from "@/hooks/use-toast";
import { Message as MessageType, QuickReply } from "../types";
import { Publisher } from "@/components/network/types";
import { useBrand } from '@/components/brands/BrandContext';
import React from "react";
import usePublisherStore from "@/stores/usePublisherStore";

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
  onPublisherSelect?: (publisher: Publisher) => void;
}

function getRandomElements<T>(arr: T[], n: number): T[] {
  if (n >= arr.length) {
    return [...arr];
  }
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
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
  onPublisherSelect,
}: UseMessageHandlersProps) => {
  const { toast } = useToast();
  const { activeBrand } = useBrand();
  const { publishers: allPublishersFromStore, getPublisherById } = usePublisherStore();

  const handlePublisherSelect = (publisherId: string) => {
    const publisher = getPublisherById(publisherId);
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
    const publisher = getPublisherById(publisherId);
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
    const newPublishersToAdd = allPublishersFromStore.filter(
      (pub) => !selectedPublishers.some((selected) => selected.id === pub.id)
    );
    if (newPublishersToAdd.length > 0) {
      setSelectedPublishers((prev) => [...prev, ...newPublishersToAdd]);
      toast({
        title: `Added ${newPublishersToAdd.length} Publishers`,
        description: "All recommended publishers have been added to your campaign summary.",
      });
      setShowSummaryPanel(true);
    } else {
      toast({
        title: "No New Publishers",
        description: "All recommended publishers are already in your campaign summary.",
        variant: "default",
      });
    }
  };

  const stepsConfig = [
    {
      id: 'start_campaign',
      triggers: ["Start a new campaign", "new campaign"],
      action: (): MessageType => {
        setCampaignStage(1);
        return {
          id: Date.now().toString(),
          content: "Great! Let's clarify your campaign budget and goals. What's your budget range for this campaign?",
          sender: "assistant",
          timestamp: new Date(),
          quickReplies: [
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
        const budgetSelection = "$10,000 - $50,000";
        setCampaignDetails((prev) => ({ ...prev, budget: budgetSelection }));
        setCampaignStage(2);

        const handleGeographySelect = (selectedStates: string[]) => {
          console.log("Selected States:", selectedStates);
          const geographyString = selectedStates.join(', ');
          setCampaignDetails((prev) => ({ ...prev, geography: geographyString }));
          setCampaignStage(3);

          const mapResponse: MessageType = {
            id: Date.now().toString(),
            content: `Great choice targeting ${geographyString}! Here's our publisher coverage in these areas:`,
            sender: "assistant",
            timestamp: new Date(),
            showMap: true,
            state: selectedStates[0],
            publishers: allPublishersFromStore,
          };
          setMessages((prev) => [...prev, mapResponse]);
          setIsTyping(false);

          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              const recommendedPublishers = allPublishersFromStore;
              setCampaignDetails((prev) => ({
                ...prev,
                timeline: "June 15 - August 30",
                estimatedReach: "1.97M",
              }));

              const recommendationsResponse: MessageType = {
                id: (Date.now() + 1).toString(),
                content: `Based on your budget and focus on ${geographyString}, I recommend these top-performing publishers for your ${activeBrand?.name ?? 'brand'} campaign:`,
                sender: "assistant",
                timestamp: new Date(),
                publishers: recommendedPublishers,
                showAddPublisherButton: true,
                // quickReplies: [
                //   { id: '9', text: `Add all ${recommendedPublishers.length}`, value: 'add-all' },
                //   { id: '10', text: 'See other options', value: 'more-options' },
                //   { id: '11', text: 'View campaign summary', value: 'view-summary' }
                // ]
              };
              setMessages((prev) => [...prev, recommendationsResponse]);
              setIsTyping(false);

              setTimeout(() => {
                setShowSummaryPanel(true);
              }, 500);
            }, 1500);
          }, 2000);
        };

        return {
          id: Date.now().toString(),
          content: `Thank you for sharing your budget. Which geographic areas (select one or more states) would you like to focus on for your ${activeBrand?.name ?? 'brand'} campaign?`,
          sender: "assistant",
          timestamp: new Date(),
          selectGeography: { onSelect: handleGeographySelect }
        };
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

    if (messages.length >= 1) {
      const lastAssistantMessage = messages[messages.length - 1];

      if (
        lastAssistantMessage.id === 'recommend_prompt' &&
        typeof userMessage.content === 'string' &&
        userMessage.content.toLowerCase().includes('recommend')
      ) {
        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        handleQuickReply(userMessage.content, 'recommend_yes', true);
        return;
      }
    }

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    let response: MessageType | null = null;
    let stepMatched = false;

    for (const step of stepsConfig) {
      const lowerContent = content.toLowerCase();
      if (step.triggers && Array.isArray(step.triggers) && step.triggers.some(trigger => lowerContent.includes(trigger.toLowerCase()))) {
        response = step.action();
        stepMatched = true;
        break;
      }
    }

    setTimeout(() => {
      if (!stepMatched) {
        response = {
          id: (Date.now() + 1).toString(),
          content: `I understand you're interested in creating a campaign for ${activeBrand?.name ?? 'your brand'}. Could you tell me more about your specific needs?`,
          sender: "assistant",
          timestamp: new Date(),
        };
      }

      if (response) {
        setMessages((prev) => {
          const newMessages = [...prev];
          if (response) {
            newMessages.push(response);
          }
          return newMessages;
        });
        setIsTyping(false);
      } else if (!stepMatched) {
        setIsTyping(false);
      }
    }, 1000);
  };

  const handleQuickReply = (text: string, value: string, isKeywordTrigger?: boolean) => {
    let assistantResponse: MessageType | null = null;

    if (value === 'recommend_yes') {
      const recommendations = getRandomElements(allPublishersFromStore, 2);
      setSelectedPublishers(prev => {
        const currentIds = new Set(prev.map(p => p.id));
        const newPublishers = recommendations.filter(p => !currentIds.has(p.id));
        return [...prev, ...newPublishers];
      });

      if (!isKeywordTrigger) {
        const interpretedUserActionMessage: MessageType = {
          id: Date.now().toString(),
          content: text,
          sender: "user",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, interpretedUserActionMessage]);
      }
      setIsTyping(true);

      const brandName = activeBrand?.name ?? 'your brand';
      const targetAudience = activeBrand?.metrics?.targetAudience?.primary ? `targeting the ${activeBrand.metrics.targetAudience.primary} audience` : 'based on its profile';
      const objectives = activeBrand?.metrics?.objectives && activeBrand.metrics.objectives.length > 0 ? `and campaign objectives like '${activeBrand.metrics.objectives[0]}'` : '';

      const recommendationNames = recommendations.map(p => p.name).join(' and ');

      assistantResponse = {
        id: (Date.now() + 1).toString(),
        content: `Sure! By looking at ${brandName}'s focus ${targetAudience}${objectives ? ` ${objectives}` : ''}, I recommend checking out ${recommendationNames}. I've added them to your summary panel for review.`,
        sender: "assistant",
        timestamp: new Date(),
        quickReplies: [{ id: '1', text: 'Start a new campaign', value: 'new' }, { id: '2', text: 'Work on an existing campaign', value: 'existing' }]
      };
      setShowSummaryPanel(true);
      setTimeout(() => {
        if (assistantResponse) {
          setMessages((prev) => {
            const newMessages = [...prev];
            if (assistantResponse) {
              newMessages.push(assistantResponse);
            }
            return newMessages;
          });
        }
        setIsTyping(false);
      }, 1000);

    } else if (value === 'recommend_no') {
      const userMessage: MessageType = {
        id: Date.now().toString(),
        content: text,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      assistantResponse = {
        id: (Date.now() + 1).toString(),
        content: `Alright, no problem. You can explore publishers yourself or ask for recommendations later. How can I help you today?`,
        sender: "assistant",
        timestamp: new Date(),
        quickReplies: [{ id: '1', text: 'Start a new campaign', value: 'new' }, { id: '2', text: 'Work on an existing campaign', value: 'existing' }]
      };
      setTimeout(() => {
        if (assistantResponse) {
          setMessages((prev) => {
            const newMessages = [...prev];
            if (assistantResponse) {
              newMessages.push(assistantResponse);
            }
            return newMessages;
          });
        }
        setIsTyping(false);
      }, 1000);
    } else {
      setInputValue('');
      handleSendMessage(text);
    }
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
  };
};
