export default {
    sendOk(res, data?: any) {
        res.status(200).json(data);
    },

    sendError(res, error?, code?) {
        res.status(500).json({
            status: 500,
            statusText: "Internal Server Error",
            error: error ? error.toString() : "",
            code: code
        });
    }
}