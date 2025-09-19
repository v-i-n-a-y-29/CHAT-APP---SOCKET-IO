import { useState } from 'react'
import io from 'socket.io-client'
import Chat from './Chat'

const socket = io.connect('http://localhost:3000')

function App() {
  const [name, setname] = useState("")
  const [room, setroom] = useState("")
  const [showChat, setShowChat] = useState(false)

  const joinRoom = () => {
    if (name != "" && room != "") {
      socket.emit("join_room", room)
      setShowChat(true)
    }
  }
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6">
        {!showChat ? (
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">Join a chat</h3>

            <input 
              type="text" 
              placeholder="Name.." 
              className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              onChange={(event) => {
                setname(event.target.value)
              }} 
            />

            <input 
              type="text" 
              placeholder="Room.." 
              className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              onChange={(event) => {
                setroom(event.target.value)
              }} 
            />

            <button 
              onClick={joinRoom}
              className="w-full p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Join a room
            </button>
          </div>
        ) : (
          <Chat socket={socket} name={name} room={room} />
        )}
      </div>
    </div>
  )
}

export default App
