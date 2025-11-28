// be/utils/response.js
export const successResponse = (res, message = "OK", data = {}) => res.status(200).json({ success: true, message, data });
export const errorResponse = (res, message = "Error", code = 400) => res.status(code).json({ success: false, message });
