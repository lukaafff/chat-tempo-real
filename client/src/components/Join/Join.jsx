import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';
import './Join.css'; 

export default function Join({ setChatVisibility, setSocket }) {
  const usernameRef = useRef();
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  const handleSubmit = async () => {
    const username = usernameRef.current.value.trim();
    if (!username) return;

    try {
      setConnecting(true);
      const socket = await io.connect('http://localhost:3001');
      socket.emit('set_username', username);
      setSocket(socket);
      setChatVisibility(true);
    } catch (error) {
      console.error('Error connecting to server:', error);
    } finally {
      setConnecting(false);
    }
  };

  const getEnterKey = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="join-container"> 
      <h1 className="join-title">Entrar</h1> 
      <p>Coloque um nome de usuário:</p>
      <input type="text" ref={usernameRef} onKeyDown={(e) => getEnterKey(e)} placeholder="Nome de usuário" className="join-input" /> 
      <button onClick={() => handleSubmit()} className="join-button" disabled={connecting}>
        {connecting ? 'Conectando...' : 'Entrar'}
      </button> 
    </div>
  );
}
