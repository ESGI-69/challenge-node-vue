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
    code = Math.random().toString(36).split('').filter((value) => /[a-z]/.test(value)).join('').substr(0, 6);
  }
  while (allGamesCodes.includes(code) && code.length === 6);
  return code;
};
