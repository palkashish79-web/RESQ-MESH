import React, { useState, useRef, useEffect } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { BotIcon, SparklesIcon, SendIcon, ShieldIcon } from './Icons';
import { DEFAULT_AI_PROMPTS } from '../data/mockData';

export const AiAssistantSection = () => {
  const { aiMessages, isAiTyping, sendAiMessage, scenario } = useDisaster();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages, isAiTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendAiMessage(inputText);
      setInputText('');
    }
  };

  const handlePromptClick = (prompt) => {
    sendAiMessage(prompt);
  };

  return (
    <div className="card-glass accent-purple ai-assistant-section">
      <div className="card-header">
        <div className="card-header-title">
          <div className="header-icon-badge purple">
            <BotIcon className="w-4 h-4 text-purple" />
          </div>
          <span>RESQ AI DISASTER COPILOT</span>
        </div>
        <div className="badge badge-purple">
          <SparklesIcon className="w-3.5 h-3.5" /> LORA MESH READY
        </div>
      </div>

      <div className="card-body ai-body">
        {/* Chat History Box */}
        <div className="chat-messages-container">
          {aiMessages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-bubble-row ${msg.sender === 'user' ? 'bubble-user' : 'bubble-bot'}`}
            >
              <div className="bubble-avatar">
                {msg.sender === 'user' ? (
                  <span>👤</span>
                ) : (
                  <ShieldIcon className="w-4 h-4 text-cyan" />
                )}
              </div>

              <div className="bubble-content-wrap">
                <div className="bubble-header">
                  <span className="bubble-sender-name">
                    {msg.sender === 'user' ? 'You' : 'ResQ Mesh Copilot'}
                  </span>
                  <span className="bubble-time">{msg.timestamp}</span>
                </div>

                <div className="bubble-text">
                  {msg.text.split('\n').map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>

                {/* Optional follow-up suggestion chips */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="suggestion-chips">
                    {msg.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        className="suggestion-chip"
                        onClick={() => handlePromptClick(sug)}
                      >
                        ⚡ {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isAiTyping && (
            <div className="chat-bubble-row bubble-bot">
              <div className="bubble-avatar">
                <ShieldIcon className="w-4 h-4 text-cyan" />
              </div>
              <div className="bubble-content-wrap">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Emergency Prompts Carousel */}
        <div className="quick-prompts-carousel">
          <span className="prompts-label">QUICK ASSISTANCE:</span>
          <div className="prompts-scroll">
            {DEFAULT_AI_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                className="prompt-pill"
                onClick={() => handlePromptClick(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form className="ai-input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="ai-text-input"
            placeholder="Ask ResQ AI: 'Nearest shelter?', 'Evacuation checklist', 'First-aid'..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" className="ai-send-btn" disabled={!inputText.trim() || isAiTyping}>
            <SendIcon className="w-4 h-4" />
          </button>
        </form>
      </div>

      <style>{`
        .ai-assistant-section {
          min-width: 0;
          width: 100%;
        }

        .ai-body {
          display: flex;
          flex-direction: column;
          height: 410px;
          padding: 0.75rem;
          min-width: 0;
        }

        .chat-messages-container {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          padding-right: 0.4rem;
          margin-bottom: 0.5rem;
          min-width: 0;
        }

        .chat-bubble-row {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          max-width: 92%;
          min-width: 0;
        }

        .bubble-user {
          margin-left: auto;
          flex-direction: row-reverse;
        }

        .bubble-avatar {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background: #090e1a;
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          flex-shrink: 0;
        }

        .bubble-content-wrap {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          min-width: 0;
          flex: 1;
        }

        .bubble-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.65rem;
        }

        .bubble-user .bubble-header {
          flex-direction: row-reverse;
        }

        .bubble-sender-name {
          font-weight: 700;
          color: var(--text-secondary);
        }

        .bubble-time {
          color: var(--text-dim);
        }

        .bubble-text {
          background: #0d1424;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.5rem 0.75rem;
          font-size: 0.76rem;
          line-height: 1.4;
          color: #f1f5f9;
          overflow-wrap: break-word;
          word-break: break-word;
        }

        .bubble-user .bubble-text {
          background: rgba(6, 182, 212, 0.15);
          border-color: rgba(6, 182, 212, 0.35);
          color: #ffffff;
        }

        .suggestion-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem;
          margin-top: 0.3rem;
          min-width: 0;
        }

        .suggestion-chip {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--cyan);
          font-family: var(--font-main);
          font-size: 0.65rem;
          font-weight: 600;
          padding: 0.18rem 0.45rem;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .suggestion-chip:hover {
          background: rgba(6, 182, 212, 0.15);
          border-color: var(--cyan);
        }

        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 0.45rem 0.75rem;
          background: #0d1424;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          width: fit-content;
        }

        .typing-indicator span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--cyan);
          animation: blink 1.2s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        .quick-prompts-carousel {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: #080c18;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.3rem 0.5rem;
          margin-bottom: 0.45rem;
          overflow: hidden;
          min-width: 0;
          width: 100%;
        }

        .prompts-label {
          font-size: 0.6rem;
          font-weight: 800;
          color: var(--text-dim);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .prompts-scroll {
          display: flex;
          gap: 0.3rem;
          overflow-x: auto;
          white-space: nowrap;
          padding-bottom: 2px;
          min-width: 0;
          flex: 1;
        }

        .prompts-scroll::-webkit-scrollbar {
          height: 3px;
        }

        .prompt-pill {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          color: #94a3b8;
          font-family: var(--font-main);
          font-size: 0.65rem;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .prompt-pill:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }

        .ai-input-form {
          display: flex;
          gap: 0.4rem;
          min-width: 0;
          width: 100%;
        }

        .ai-text-input {
          flex: 1;
          background: #090e1a;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 0.45rem 0.75rem;
          color: #ffffff;
          font-family: var(--font-main);
          font-size: 0.78rem;
          outline: none;
          min-width: 0;
          transition: border-color 0.2s ease;
        }

        .ai-text-input:focus {
          border-color: var(--cyan);
        }

        .ai-send-btn {
          background: var(--cyan);
          border: none;
          color: #080c16;
          padding: 0.45rem 0.8rem;
          border-radius: var(--radius-md);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: opacity 0.2s ease, transform 0.1s ease;
        }

        .ai-send-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .ai-send-btn:not(:disabled):hover {
          box-shadow: 0 0 12px var(--cyan);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};
