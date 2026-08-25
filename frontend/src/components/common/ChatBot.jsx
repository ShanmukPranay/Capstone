import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  X,
  Minimize2,
  Maximize2,
  Bot,
  User,
  Sparkles,
  FileText,
  Link,
  ExternalLink,
  Shield,
  Clock,
  ChevronRight,
  Loader2,
  Cpu,
  Zap
} from 'lucide-react';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! I\'m your Legal Document Assistant. I can help you analyze legal documents, extract information, and find evidence. What would you like to know?',
      timestamp: new Date().toLocaleTimeString(),
      suggestions: [
        'What are the termination conditions?',
        'Who are the parties?',
        'What is the notice period?',
        'What obligations does the employee have?',
        'Identify potential risks.',
        'Show evidence for the termination clause.'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(input);
      setIsTyping(false);
      setMessages(prev => [...prev, botResponse]);
    }, 1500);
  };

  const getBotResponse = (query) => {
    const responses = {
      'termination': {
        text: 'Based on the document analysis, the termination clause requires a 30-day written notice period. The employee must provide written notice before termination.',
        evidence: 'Page 5, Section 8.2',
        confidence: 94,
        type: 'bot'
      },
      'parties': {
        text: 'The agreement is between ABC Technologies Pvt. Ltd. (Employer) and John Doe (Employee).',
        evidence: 'Page 1, Section 1.1',
        confidence: 98,
        type: 'bot'
      },
      'notice': {
        text: 'The notice period required is 30 days. Written notice must be provided by the employee before termination.',
        evidence: 'Page 5, Section 8.2',
        confidence: 94,
        type: 'bot'
      },
      'obligations': {
        text: 'The employee must provide written notice before termination. Additionally, the employee must maintain confidentiality of company information.',
        evidence: 'Page 6, Section 7.1',
        confidence: 89,
        type: 'bot'
      },
      'risks': {
        text: 'I\'ve identified 3 potential risks: 1) Unclear termination penalty (High Risk), 2) Broad confidentiality obligation (Medium Risk), 3) Ambiguous non-compete scope (High Risk).',
        evidence: 'Risk Analysis Report',
        confidence: 87,
        type: 'bot'
      },
      'evidence': {
        text: 'The termination clause evidence is found in Section 8.2: "Employee shall provide written notice of termination at least thirty days prior to the intended termination date."',
        evidence: 'Page 5, Section 8.2',
        confidence: 94,
        type: 'bot'
      }
    };

    let defaultResponse = {
      text: 'I understand your question. Based on the document analysis, I can help you with termination clauses, parties identification, notice periods, employee obligations, risk detection, and evidence verification. Could you please rephrase your question more specifically?',
      evidence: 'General knowledge',
      confidence: 85,
      type: 'bot'
    };

    const lowerQuery = query.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerQuery.includes(key)) {
        return {
          id: messages.length + 2,
          ...response,
          timestamp: new Date().toLocaleTimeString(),
          suggestions: [
            'What are the termination conditions?',
            'Who are the parties?',
            'What is the notice period?',
            'Show evidence for the termination clause.'
          ]
        };
      }
    }

    return {
      id: messages.length + 2,
      ...defaultResponse,
      timestamp: new Date().toLocaleTimeString(),
      suggestions: [
        'What are the termination conditions?',
        'Who are the parties?',
        'What is the notice period?',
        'Identify potential risks.',
        'Show evidence for the termination clause.'
      ]
    };
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setTimeout(() => {
      const userMessage = {
        id: messages.length + 1,
        type: 'user',
        text: suggestion,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsTyping(true);

      setTimeout(() => {
        const botResponse = getBotResponse(suggestion);
        setIsTyping(false);
        setMessages(prev => [...prev, botResponse]);
      }, 1500);
    }, 300);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button className="chat-toggle-btn robot-toggle" onClick={() => setIsOpen(true)}>
        <div className="robot-icon">
          <Cpu size={28} />
          <div className="robot-eyes">
            <span className="eye"></span>
            <span className="eye"></span>
          </div>
        </div>
        <span className="chat-toggle-badge">3</span>
        <span className="chat-toggle-label">AI Assistant</span>
      </button>
    );
  }

  return (
    <div className={`chat-container ${isMinimized ? 'minimized' : ''}`}>
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="chat-avatar robot-avatar">
            <Cpu size={22} />
          </div>
          <div className="chat-header-info">
            <span className="chat-title">Legal AI Assistant</span>
            <span className="chat-status">● Online</span>
          </div>
        </div>
        <div className="chat-header-actions">
          <button className="chat-minimize-btn" onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
          <button className="chat-close-btn" onClick={() => setIsOpen(false)}>
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Chat Messages */}
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message-wrapper ${message.type === 'user' ? 'user' : 'bot'}`}>
                <div className={`message-bubble ${message.type === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
                  <div className="message-header">
                    <span className="message-sender">
                      {message.type === 'user' ? <User size={14} /> : <Cpu size={14} />}
                      {message.type === 'user' ? 'You' : 'AI Assistant'}
                    </span>
                    <span className="message-time">{message.timestamp}</span>
                  </div>
                  <div className="message-text">{message.text}</div>
                  
                  {message.evidence && (
                    <div className="message-evidence">
                      <Shield size={14} />
                      <span>Evidence: {message.evidence}</span>
                      <span className="evidence-conf">{message.confidence}% confidence</span>
                    </div>
                  )}

                  {message.suggestions && message.type === 'bot' && index === messages.length - 1 && (
                    <div className="message-suggestions">
                      <span className="suggestions-label">Try asking:</span>
                      <div className="suggestion-chips">
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            className="suggestion-chip"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <ChevronRight size={12} />
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message-wrapper bot">
                <div className="message-bubble bot-bubble typing-indicator">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="chat-input-container">
            <div className="chat-input-wrapper">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask a question about your document..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="chat-input"
              />
              <button
                className={`chat-send-btn ${input.trim() ? 'active' : ''}`}
                onClick={handleSend}
                disabled={!input.trim()}
              >
                {isTyping ? <Loader2 size={20} className="spin" /> : <Send size={20} />}
              </button>
            </div>
            <div className="chat-footer">
              <span className="chat-footer-text">
                <Zap size={12} />
                AI-powered legal analysis
              </span>
              <button className="chat-footer-btn" onClick={() => {
                const lastBotMessage = messages.filter(m => m.type === 'bot').pop();
                if (lastBotMessage?.evidence) {
                  alert(`Evidence: ${lastBotMessage.evidence}\nConfidence: ${lastBotMessage.confidence}%`);
                }
              }}>
                <Link size={12} />
                View Evidence
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatBot;