import React, {useRef, useState, useEffect} from 'react'

export default function Chat({socket}) {

    const bottomRef = useRef()
    const messageRef = useRef()
    const [messageList, setMessageList] = useState([])

    useEffect(()=>{
        socket.on('receive_message', data => {
            setMessageList((current) => [...current, data])
        })

        return () => socket.off('receive_message')
    },[socket])

    const handleSubmit = () => {
        const message = messageRef.current.value
        if(!message.trim()) 
        return

        socket.emit('message', message)
        clearInput()
        focusInput()
    }

    const clearInput = () => {
        messageRef.current.value = ''
    }

    const focusInput = () => {
        messageRef.current.focus()
      }
    
      const getEnterKey = (e) => {
        if(e.key === 'Enter')
          handleSubmit()
      }
    
      const scrollDown = () => {
        bottomRef.current.scrollIntoView({behavior: 'smooth'})
      }

  return (
    <div>
        <h1>Chat</h1>
        {
            messageList.map((message, index) => (
                <p key={index}>{message.author}: {message.text}</p>
            ))
        }
        <div ref={bottomRef} />
        <input type="text" ref={messageRef} placeholder='Mensagem' onKeyDown={(e)=> getEnterKey(e)}/>
        <button onClick={() => handleSubmit()}>Enviar</button>
    </div>
  )
}
