function removeDuplicates(inputStr) {
    // Use a Set to store unique characters
    let uniqueChars = new Set();

    // Array to store unique characters in order
    let result = [];

    // Iterate through each character in the input string
    for (let char of inputStr) {
        // Check if the character is not already in the Set
        if (!uniqueChars.has(char)) {
            // If not, add it to the Set and push it to the result array
            uniqueChars.add(char);
            result.push(char);
        }
    }

    // Join the characters in the result array to form the final string
    return result.join('');
}
export default removeDuplicates;