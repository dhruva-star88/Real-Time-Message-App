const io = require("socket.io")(8801, {
    cors: {
        origin:"http://localhost:3002"
    }
})

// The Users that has subscribed or resigered to the connection
let activeUsers = []

//Switch on the server
io.on("connection", (socket) => {
    // Registering the user on socket server
    socket.on('new-user-add', (newUserId) => {
        // If user is not added previously
        if(!activeUsers.some((user) => user.userId === newUserId)){
            activeUsers.push({
                userId: newUserId,
                socketId: socket.id
            })
        }
        // To send
        console.log("Connected users", activeUsers)
        io.emit('get-users', activeUsers)
    })

    // Send Message
    socket.on('send-message', (data) => {
        const {receiverId} = data;
        const user = activeUsers.find((user) => user.userId === receiverId)
        console.log("Sending the Message towards(id): ", receiverId)
        console.log("Data: ", data)
        if(user){
            io.to(user.socketId).emit("receive-message", data)
        }
    })
    
    socket.on('disconnect', () => {
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
        console.log("User Disconnected", activeUsers)
        io.emit('get-users', activeUsers)
    })
})