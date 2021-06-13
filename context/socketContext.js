import React from 'react';
import socketio from 'socket.io-client'

export const io = socketio();
export const SocketContext = React.createContext(); 

io.on('connect', (data)=>{
    console.log('connected to socket')
})
