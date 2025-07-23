// utils/validators.js
export const isUBCStudentEmail = (email) => {
    // must be something + @student.ubc.ca (no subdomains before student?)
    // cwl IDs are typically alphanumeric+maybe punctuation but we'll be permissive:
    const ubcPattern = /^[a-z0-9._-]+@student\.ubc\.ca$/i;
    return ubcPattern.test(email.trim());
};