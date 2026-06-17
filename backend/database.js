const bookings = [];
const users = [];

module.exports = {
    run: (query, params, callback) => {
        if (query.includes("INSERT INTO bookings")) {
            bookings.push({
                id: bookings.length + 1,
                name: params[0],
                service: params[1]
            });
            callback && callback.call({ lastID: bookings.length });
        } else if (query.includes("INSERT INTO users")) {
            users.push({
                id: users.length + 1,
                username: params[0],
                password: params[1]
            });
            callback && callback();
        }
    },

    get: (query, params, callback) => {
        const user = users.find(u => u.username === params[0]);
        callback(null, user);
    },

    all: (query, params, callback) => {
        callback(null, bookings);
    }
};
