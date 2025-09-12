const express = require('express');
const app = express();


const { createServer } = require('node:http');
const { join } = require('node:path')
const { Server } = require('socket.io')
const friendRoutes = require('./Routes/Snake');





const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
});


const mongoose = require('mongoose');
const path = require('path')
const cors = require('cors')
const dotenv = require('dotenv');

//AuthRoutes
const AuthRoutes = require('./Routes/Client');
const { send } = require('node:process');
// const { rootCertificates } = require('node:tls');
// const { Socket } = require('node:dgram');

dotenv.config();

const port = process.env.PORT || 8000;

//MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MONODB Connected");
    })
    .catch((err) => {
        console.error("MongoDB Connection Failed", err);
    })

//ye use hota hai jab form data handle karte ho e.g - POST/signup se req.body me data lena ho , iske bina req.body empty rahegi
// ye use hota hai agar tum frontend se JSON Data bhej rahe ho e.g - React form using Axios , frontend se backend ko ane wale data ko samjhne ke liye
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


app.get('/', (req, res) => {
    res.send('Hello Good Morning')
})

app.use('/User', AuthRoutes);
app.use('/api/friend', friendRoutes);


io.on("connection", (socket) => {
    //Join room with their own userId
    socket.on("register", (userId) => {
        // user Joins their own room
        socket.join(userId);
        socket.data.userId = userId;
        io.emit("userOnline", { userId, status: true });
        console.log(userId)
    })
    //Room Join (for sender + receiver)
    socket.on("joinRoom", ({ senderId, receiverId }) => {
        const roomId = [senderId, receiverId].sort().join("_");
        socket.join(roomId);
        console.log(`User ${senderId} joined room ${roomId}`);
    });

    socket.on("sendMessage", (msg) => {
        const { senderId, receiverId, message, time } = msg;
        console.log(message)

        const roomId = [senderId, receiverId].sort().join("_");

        //Joinboth users into the same room
        socket.join(roomId);

        io.to(roomId).emit("receiveMessage", msg);
    })
    socket.on("typing", ({ senderId, receiverId }) => {
        const roomId = [senderId, receiverId].sort().join("_");
        socket.to(roomId).emit("friendTyping", { senderId });
    });

    socket.on('offer', ({ offer, roomId }) => {
        console.log(`Offer received in room ${roomId}`);
        socket.to(roomId).emit('offer', { offer });
    });

    // WebRTC signaling: Answer
    socket.on('answer', ({ answer, roomId }) => {
        console.log(`Answer received in room ${roomId}`);
        socket.to(roomId).emit('answer', { answer });
    });

    // WebRTC signaling: ICE candidate
    socket.on('ice-candidate', ({ candidate, roomId }) => {
        console.log(`ICE candidate in room ${roomId}`);
        socket.to(roomId).emit('ice-candidate', { candidate });
    });

    // ✅ Handle Disconnect
    socket.on('disconnect', () => {
        const userId = socket.data.userId;
        if (userId) {
            io.emit('userOnline', { userId, status: false });
            console.log(`User disconnected: ${userId}`);
        }
    });

    socket.on("end-call", ({ roomId }) => {
        // Send event to other users in the same room
        socket.to(roomId).emit("end-call");
        console.log(`Call ended in room ${roomId}`);
    });

});
server.listen(port, () => {
    console.log("App Listening on PORT")
});