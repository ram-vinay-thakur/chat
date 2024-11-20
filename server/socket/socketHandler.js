export const handleSocketEvents = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('message', (data) => {
            console.log(`Message from ${socket.id}:`, data);
            io.emit('broadcast', { sender: socket.id, message: data });
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};
