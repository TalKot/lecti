export default {
    sendOk(res, data?: any) {
        res.status(200).json(data);
    },

    sendError(res, error?, code?) {
        res.status(code || 500).json({
            status: code,
            statusText: "Internal Server Error",
            error: error ? error.toString() : ""
        });
    }
}