// Middleware to attach socket.io instance to requests
export const attachSocketIO = (io) => {
    return (req, res, next) => {
        req.io = io;
        next();
    };
};