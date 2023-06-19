import { reactive } from 'vue';
import { io } from 'socket.io-client';

export const state = reactive({
  connected: false,
  fooEvents: [],
  barEvents: [],
});

// TODO use env variable
// export const socket = io(import.meta.env.VITE_API);
export const socket = io('http://localhost:3000/');

export const connect = () => new Promise((resolve) => {
  socket.connect();
  if (state.connected) {
    resolve();
  } else {
    socket.on('connect', () => {
      resolve();
    });
  }
});

socket.on('connect', () => {
  state.connected = true;
});

socket.on('disconnect', () => {
  state.connected = false;
});
