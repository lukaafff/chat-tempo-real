import React, { useRef, useState, useEffect } from 'react';
import './chat.css';

export default function Chat({ socket }) {
  const messageContainerRef = useRef();
  const messageRef = useRef();
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    messageRef.current.focus();
  }, []);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessageList((current) => [...current, data]);
      scrollToBottom();
    });

    return () => socket.off('receive_message');
  }, [socket]);

  const handleSubmit = () => {
    const message = messageRef.current.value;
    if (!message.trim()) return;

    socket.emit('message', message);
    clearInput();
    scrollToBottom();
  };

  const clearInput = () => {
    messageRef.current.value = '';
  };

  const scrollToBottom = () => {
    messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
  };

  const getEnterKey = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>Chat</h1>
      </div>
      <div className="chat-messages" ref={messageContainerRef}>
        {messageList.map((message, index) => (
          <p key={index}>
            {message.author}: {message.text}
          </p>
        ))}
      </div>
      <div className="chat-input-container">
        <input type="text" ref={messageRef} placeholder="Mensagem" onKeyDown={(e) => getEnterKey(e)} className="chat-input" />
        <button onClick={() => handleSubmit()} className="chat-button">Enviar</button>
      </div>
    </div>
  );
}