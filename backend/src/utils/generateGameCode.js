import game from '../services/game.js';

/**
 * Generate a unique 6 characters long string with random letters and numbers.
 * Used to generate a game code.
 * @returns {Promise<string>}
 */
export default async () => {
  const allGamesCodes = await game.findAllIds();
  let code = '';
  do {
    code = Math.random().toString(36).substring(2, 8);
    console.log(code);
  }
  while (allGamesCodes.includes(code));
  return code;
};
