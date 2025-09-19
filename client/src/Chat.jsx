import React, { useEffect, useState, useRef } from 'react'

function Chat({ socket, name, room }) {
  const [currmessage, setcurrmessage] = useState('')
  const [messagesData, setMessagesData] = useState([]) //an array of messageData
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messagesData]);

  const sendMessage = async () => {
    const text = currmessage.trim()
    if (text !== '') {
      const messageData = {
        room: room,
        author: name,
        message: text,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      }

      await socket.emit('sendMessage', messageData)
      setMessagesData((list) => [...list, messageData]);
      setcurrmessage('')
    }
  }

  useEffect(() => {
    const handleReceive = (data) => {
      setMessagesData((list) => [...list, data])
    }

    socket.on('receive_message', handleReceive)

    return () => {
      socket.off('receive_message', handleReceive)
    }
  }, [socket])

  return (
    <div className="flex justify-center">
      <div className="w-[350px] h-[500px] bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
        {/* Chat Header */}
        <div className="h-[50px] bg-[#263238] text-white flex items-center justify-center">
          <p className="text-xl font-bold m-0">Live Chat</p>
        </div>
        
        {/* Chat Body */}
        <div className="flex-grow p-2.5 border-t border-b border-gray-200 overflow-y-auto bg-gray-50 flex flex-col">
          <div className="flex flex-col w-full">
            {messagesData.map((messageContent, index) => {
              const isYou = name === messageContent.author;
              return (
                <div
                  key={index}
                  className={`mb-3 max-w-[70%] p-2 px-3 rounded-2xl text-sm leading-relaxed
                    ${isYou ? 
                      'self-end bg-[#4d90fe] text-white rounded-br-sm' : 
                      'self-start bg-gray-200 text-black rounded-bl-sm'}`}
                >
                  <div>
                    <div className="m-0">
                      <p className="m-0">{messageContent.message}</p>
                    </div>
                    <div className={`flex gap-1 text-xs mt-1 ${isYou ? 'text-gray-200' : 'text-gray-500'}`}>
                      <p className="m-0">{messageContent.author}</p>
                      <p className="m-0">{messageContent.time}</p>
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Chat Footer */}
        <div className="h-[60px] flex p-2.5 bg-white">
          <input
            type="text"
            placeholder="Hey.."
            value={currmessage}
            onChange={(event) => {
              setcurrmessage(event.target.value)
            }}
            onKeyPress={(event) => {
              event.key === "Enter" && sendMessage();
            }}
            className="flex-grow border border-gray-300 rounded-full px-4 mr-2.5 focus:outline-none focus:border-[#4d90fe]"
          />
          <button 
            onClick={sendMessage}
            className="w-10 h-10 rounded-full bg-[#4d90fe] text-white text-xl flex items-center justify-center hover:bg-[#357ae8] transition duration-300"
          >
            &#9658;
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat
