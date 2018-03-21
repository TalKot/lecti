"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    sendOk(res, data) {
        res.status(200).json(data);
    },
    sendError(res, error, code) {
        res.status(code || 500).json({
            status: code,
            statusText: "Internal Server Error",
            error: error ? error.toString() : ""
        });
    }
};
//# sourceMappingURL=httpResponse.js.map