/* eslint-disable @typescript-eslint/no-explicit-any */
export const getErrorMessage = (err: any): string => {
    const message = err?.response?.data?.message || "";
    const status = err?.response?.status;

    if (err?.message === "Network Error") {
        return "Network error. Please check your internet connection.";
    }
    if (status === 409 || message.toLowerCase().includes("already exists") || message.toLowerCase().includes("duplicate")) {
        return "An account with this email already exists.";
    }
    if (status === 401) {
        return "Invalid email or password.";
    }
    if (status === 403) {
        return "Your account has been blocked. Please contact support.";
    }
    if (status === 422) {
        return "Invalid data provided. Please check your inputs.";
    }
    if (status >= 500) {
        return "Server error. Please try again later.";
    }
    if (message) {
        return message;
    }
    return "Something went wrong. Please try again.";
};