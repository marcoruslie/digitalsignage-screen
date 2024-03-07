// plugins/socket.js
import io from 'socket.io-client';

const socket = io('http://10.10.3.193:3000/api/socket.io');

socket.on('chat', (data) => {
  console.log('Received message from server:', data);
});

export default socket;
