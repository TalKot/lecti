"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    sendOk(res, data) {
        res.status(200).json(data);
    },
    //TODO: DELETE THIS COMMENT
    // sendError(res, error?, code?) {
    //     res.status(500).json({
    //         status: 500,
    //         statusText: "Internal Server Error",
    //         error: error ? error.toString() : "",
    //         code: code
    //     });
    // }
    sendError(res, error, code) {
        res.status(code || 500).json({
            status: code,
            statusText: "Internal Server Error",
            error: error ? error.toString() : ""
        });
    }
};
//# sourceMappingURL=httpResponse.js.map