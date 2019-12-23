module.exports = function okBoomer(req, res, next) {
    /**
     * A small amount of complexity here, where we need to modify `res.send`
     * Ensures we intercept a 200 response and set the message correctly
     */
    const oldSend = res.send;
    const modifiedSend =  (data) => {
        if (res.statusCode === 200) {
            res.statusMessage = 'OK Boomer';
        }

        // Use the original send method
        oldSend.apply(res, [data]);
    }

    res.send = modifiedSend;

    next();
};