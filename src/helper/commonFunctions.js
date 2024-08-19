export function validatePassword(password) {
    const lengthRegex = /.{8,}/; // At least 8 characters
    const uppercaseRegex = /[A-Z]/; // At least one uppercase letter
    const lowercaseRegex = /[a-z]/; // At least one lowercase letter
    const digitRegex = /[0-9]/; // At least one digit
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/; // At least one special character

    // Validate each criterion
    if (!lengthRegex.test(password)) {
        return "Password must be at least 8 characters long";
    }
    if (!uppercaseRegex.test(password)) {
        return "Password must contain at least one uppercase letter";
    }
    if (!lowercaseRegex.test(password)) {
        return "Password must contain at least one lowercase letter";
    }
    if (!digitRegex.test(password)) {
        return "Password must contain at least one digit";
    }
    if (!specialCharRegex.test(password)) {
        return "Password must contain at least one special character";
    }
    return false;
}