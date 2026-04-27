/* eslint-disable @typescript-eslint/no-explicit-any */
export const getErrorMessage = (err: any): string => {
    const message = (err?.response?.data?.message || "").toLowerCase();
    const status = err?.response?.status;

    if (err?.message === "Network Error") {
        return "Network error. Please check your internet connection.";
    }

    // ─── 400 Bad Request ──────────────────────────────────────────
    if (status === 400) {
        if (message.includes("invalid data") || message.includes("validation")) {
            return "Invalid data provided. Please check your inputs.";
        }
        return "Bad request. Please check your inputs.";
    }

    // ─── 401 Unauthorized ─────────────────────────────────────────
    if (status === 401) {
        if (message.includes("password") || message.includes("credentials") || message.includes("invalid")) {
            return "Invalid email or password.";
        }
        if (message.includes("expired") || message.includes("session")) {
            return "Your session has expired. Please log in again.";
        }
        if (message.includes("token")) {
            return "Authentication failed. Please log in again.";
        }
        return "Invalid email or password.";
    }

    // ─── 403 Forbidden ────────────────────────────────────────────
    if (status === 403) {
        if (message.includes("verify") || message.includes("not verified")) {
            return "Please verify your email before logging in.";
        }
        if (message.includes("blocked") || message.includes("suspended") || message.includes("banned")) {
            return "Your account has been blocked. Please contact support.";
        }
        return "You do not have permission to perform this action.";
    }

    // ─── 404 Not Found ────────────────────────────────────────────
    if (status === 404) {
        if (message.includes("user") || message.includes("account") || message.includes("email")) {
            return "No account found with this email address.";
        }
        return "The requested resource was not found.";
    }

    // ─── 409 Conflict ─────────────────────────────────────────────
    if (status === 409 || message.includes("already exists") || message.includes("duplicate")) {
        if (message.includes("email")) {
            return "An account with this email already exists.";
        }
        if (message.includes("phone")) {
            return "This phone number is already in use.";
        }
        return "This record already exists.";
    }

    // ─── 410 Gone ─────────────────────────────────────────────────
    if (status === 410) {
        return "This link has expired. Please request a new one.";
    }

    // ─── 422 Unprocessable ────────────────────────────────────────
    if (status === 422) {
        return "Invalid data provided. Please check your inputs.";
    }

    // ─── 429 Rate Limit ───────────────────────────────────────────
    if (status === 429) {
        return "Too many attempts. Please wait a moment and try again.";
    }

    // ─── 500+ Server Error ────────────────────────────────────────
    if (status >= 500) {
        if (message.includes("database") || message.includes("connection")) {
            return "Database error. Please try again later.";
        }
        return "Server error. Please try again later.";
    }

    // ─── Message based fallback ───────────────────────────────────
    if (message.includes("network") || message.includes("timeout")) {
        return "Network error. Please check your internet connection.";
    }
    if (message.includes("invalid password") || message.includes("invalid credentials")) {
        return "Invalid email or password.";
    }
    if (message.includes("not found") || message.includes("no account")) {
        return "No account found with this email address.";
    }
    if (message.includes("verify") || message.includes("not verified")) {
        return "Please verify your email before logging in.";
    }
    if (message.includes("blocked") || message.includes("suspended")) {
        return "Your account has been blocked. Please contact support.";
    }
    if (message.includes("expired")) {
        return "Your session has expired. Please log in again.";
    }

    // ─── Raw message fallback ─────────────────────────────────────
    if (err?.response?.data?.message) {
        return err.response.data.message;
    }

    return "Something went wrong. Please try again.";
};