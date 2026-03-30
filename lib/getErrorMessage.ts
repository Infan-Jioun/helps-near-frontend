/* eslint-disable @typescript-eslint/no-explicit-any */
export const getErrorMessage = (err: any): string => {
    if (err?.response?.data?.message) {
        return err.response.data.message;
    }
    if (err?.response?.data?.errors?.[0]?.message) {
        return err.response.data.errors[0].message;
    }
    if (err?.message === "Network Error") {
        return "Network error. Please check your internet connection.";
    }
    if (err?.response?.status === 401) {
        return "Invalid email or password.";
    }
    if (err?.response?.status === 403) {
        return "You do not have permission to perform this action.";
    }
    if (err?.response?.status === 404) {
        return "Not found.";
    }
    if (err?.response?.status === 409) {
        return "An account with this email already exists.";
    }
    if (err?.response?.status === 422) {
        return "Invalid data provided. Please check your inputs.";
    }
    if (err?.response?.status >= 500) {
        return "Server error. Please try again later.";
    }
    return "Something went wrong. Please try again.";
};