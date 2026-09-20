import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, X, Link, Shield, Loader2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Welcome message when opened for first time
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: Date.now(),
          type: 'bot',
          text: "Hello! I'm your Legal Document Assistant. I can help you analyze legal documents, extract information, and find evidence. What would you like to know?",
          timestamp: new Date().toLocaleTimeString(),
          suggestions: [
            'What is the notice period?',
            'What are the termination conditions?',
            'Who are the parties?',
            'Show evidence for the termination clause.'
          ]
        }
      ]);
    }
  }, [isOpen]);

  // Create session on first open
  useEffect(() => {
    if (isOpen && !sessionId) {
      api.createChatSession('default-user', null, 'Chat')
        .then(data => {
          setSessionId(data.session.id);
        })
        .catch(err => {
          console.error('Failed to create chat session:', err);
          toast.error('Could not connect to backend');
        });
    }
  }, [isOpen, sessionId]);

  const handleSend = async (text = null) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      if (!sessionId) {
        throw new Error('Chat session not ready. Please wait...');
      }

      // Call real backend
      const data = await api.sendChatMessage(
        sessionId,
        'default-user',
        messageText,
        null
      );

      const botMsg = {
        id: Date.now() + 1,
        type: 'bot',
        text: data.message?.content || 'No response',
        timestamp: new Date().toLocaleTimeString(),
        citations: data.citations || [],
        model: data.message?.model_used,
        confidence: data.message?.confidence || 85,
        suggestions: [
          'What are the termination conditions?',
          'Who are the parties?',
          'Show evidence for the termination clause.'
        ]
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, {
        id: Date.now() + 2,
        type: 'bot',
        text: `⚠️ Error: ${err.message}. Make sure backend is running.`,
        timestamp: new Date().toLocaleTimeString(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const viewEvidence = (msg) => {
    if (msg.citations && msg.citations.length > 0) {
      setSelectedEvidence(msg.citations[0]);
    } else {
      toast.error('No evidence for this message');
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className="chatbot-float-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open chat"
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-container">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <div className="chatbot-avatar">
                <Bot size={20} />
              </div>
              <div>
                <div className="chatbot-title">Legal AI Assistant</div>
                <div className="chatbot-status">
                  <span className="status-dot"></span>
                  {sessionId ? 'Online' : 'Connecting...'}
                </div>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message message-${msg.type}`}>
                <div className="message-header">
                  {msg.type === 'bot' ? <Bot size={14} /> : <User size={14} />}
                  <span>{msg.type === 'bot' ? 'AI Assistant' : 'You'}</span>
                  <span className="message-time">{msg.timestamp}</span>
                </div>
                <div className="message-text">{msg.text}</div>

                {msg.citations && msg.citations.length > 0 && (
                  <div className="message-evidence">
                    <Shield size={14} />
                    <span>
                      Evidence: Chunk #{msg.citations[0].chunk_index} ·
                      {' '}{(msg.citations[0].similarity * 100).toFixed(0)}% match
                    </span>
                  </div>
                )}

                {msg.suggestions && (
                  <div className="message-suggestions">
                    <div className="suggestions-label">Try asking:</div>
                    {msg.suggestions.map((s, i) => (
                      <button
                        key={i}
                        className="suggestion-chip"
                        onClick={() => handleSend(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="message message-bot">
                <div className="message-header">
                  <Bot size={14} />
                  <span>AI Assistant</span>
                </div>
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Evidence Panel */}
          {selectedEvidence && (
            <div className="evidence-panel">
              <div className="evidence-panel-header">
                <Shield size={16} />
                <span>Evidence Details</span>
                <button onClick={() => setSelectedEvidence(null)}>
                  <X size={14} />
                </button>
              </div>
              <div className="evidence-panel-body">
                <div className="evidence-row">
                  <strong>Chunk Index:</strong> {selectedEvidence.chunk_index}
                </div>
                <div className="evidence-row">
                  <strong>Similarity:</strong> {(selectedEvidence.similarity * 100).toFixed(1)}%
                </div>
                <div className="evidence-row">
                  <strong>Document:</strong> {selectedEvidence.document_id?.slice(0, 20)}...
                </div>
                <div className="evidence-excerpt">
                  <strong>Excerpt:</strong>
                  <p>{selectedEvidence.excerpt || '(no excerpt)'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="chatbot-input-container">
            <textarea
              className="chatbot-input"
              placeholder="Ask a question about your document..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={1}
            />
            <button
              className="chatbot-send-btn"
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isTyping}
            >
              {isTyping ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
            </button>
          </div>

          {/* Footer */}
          <div className="chatbot-footer">
            <button
              className="chat-footer-btn"
              onClick={() => {
                const lastBot = messages.filter(m => m.type === 'bot').pop();
                if (lastBot?.citations?.length > 0) {
                  viewEvidence(lastBot);
                } else {
                  toast.error('No evidence available');
                }
              }}
            >
              <Link size={12} />
              View Evidence
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;