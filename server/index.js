const express= require('express')
const app = express()
const http = require('http')
const cors = require('cors')
const {Server} = require('socket.io')
app.use(cors())

app.get('/' , function(req,res){
    res.send("helo")
})

const server = http.createServer(app)
const io = new Server(server , {
    cors:{
        origin : "http://localhost:5173"
    }
})

io.on('connection' , (socket)=>{
    console.log(`user connect with id: ${socket.id}`)

    socket.on("join_room", (room)=>{
        socket.join(room)
        console.log(`User with id ${socket.id} joined the room ${room}`)
    })

    socket.on("sendMessage" , (data)=>{
        socket.to(data.room).emit("receive_message" , data)
    })

    socket.on('disconnect' , ()=>{
        console.log("user disconnected with id", socket.id)
    })
})


server.listen(3000 , ()=>{
    console.log("server is running at port 3000")
})