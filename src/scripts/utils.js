export const normalizeTimestamp = (timestamp) => {
    const date = timestamp.split('T')[0];
    const time = timestamp.split('T')[1].split('.')[0];
    return `${date} ${time}`;
}

export const humanizeString = (str) => {
    return str
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before uppercase letters
        .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // Add space between consecutive uppercase and lowercase letters
        .replace(/_/g, ' ') // Replace underscores with spaces
        .toLowerCase() // Convert to lowercase
        .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize the first letter of each word
}

export const debounce = (func, delay = 300) => {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}