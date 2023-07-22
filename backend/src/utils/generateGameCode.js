/**
 * Generate a unique 6 characters long string with random letters and numbers.
 * Used to generate a game code.
 * @returns {Promise<string>}
 */
export default () => {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let uniqueID = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueID += characters.charAt(randomIndex);
  }

  return uniqueID;
};
