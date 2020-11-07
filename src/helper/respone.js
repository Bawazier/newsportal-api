module.exports = (respone, message, data, status = 200, success = true) => {
    return respone.status(status).send({
        success: success,
        message: message,
        ...data
    });
};