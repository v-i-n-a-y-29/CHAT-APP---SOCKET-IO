const express= require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const {Server} = require('socket.io')

// Allow CORS from configurable origins (comma-separated)
const clientOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map(o => o.trim())

app.use(cors({ origin: clientOrigins }))

app.get('/' , function(req,res){
    res.send("helo")
})

const server = http.createServer(app)
const io = new Server(server , {
    cors:{
        origin : clientOrigins
    }
})

io.on('connection' , (socket)=>{
    console.log(`user connect with id: ${socket.id}`)

    socket.on("join_room", (room)=>{
        socket.join(room)
        console.log(`User with id ${socket.id} joined the room ${room}`)
    })

    socket.on("sendMessage" , (data)=>{
        console.log(`received message from ${data.author} in room ${data.room}: ${data.message}`)
        // Emit to everyone in the room (including sender) so all clients update
        io.in(data.room).emit("receive_message", data)
    })

    socket.on('disconnect' , ()=>{
        console.log("user disconnected with id", socket.id)
    })
})


const PORT = process.env.PORT || 3000
server.listen(PORT , ()=>{
    console.log(`server is running at port ${PORT}`)
})