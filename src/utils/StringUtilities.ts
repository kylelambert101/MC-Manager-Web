/**
 * Get the title-case version of `str`, with the first letter of
 * each word capitalized
 * @param str
 */
// eslint-disable-next-line import/prefer-default-export
export const convertToTitleCase = (str: string): string => {
  return str
    .split(' ')
    .map((word) =>
      word.length > 0
        ? word[0].toUpperCase() + word.substr(1).toLowerCase()
        : word
    )
    .join(' ');
};
