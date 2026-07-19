export const getRelativePath = (fileHandlePath, rootName) => {
    if (!fileHandlePath) return '';
    const parts = fileHandlePath.split('/');
    if (parts.length > 0 && parts[0] === rootName) {
      parts.shift();
    }
    return parts.join('/');
};
