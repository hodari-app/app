function markdownItDel(md) {
  // Add the rule to handle --text--
  md.inline.ruler.push('del', (state, silent) => {
    let start = state.pos;
    let marker = state.src.charCodeAt(start);

    if (silent) {
      return false;
    }

    // Check if we have a double dash
    if (marker !== 0x2d /* - */) {
      return false;
    }
    if (state.src.charCodeAt(start + 1) !== 0x2d /* - */) {
      return false;
    }

    let pos = start + 2;
    let max = state.posMax;

    // Find the end marker
    while (pos + 2 < max) {
      if (
        state.src.charCodeAt(pos) === 0x2d /* - */ &&
        state.src.charCodeAt(pos + 1) === 0x2d /* - */
      ) {
        // Create the token
        state.push('del_open', 'del', 1);

        // Process the content as markdown
        let oldPos = state.pos;
        let oldMax = state.posMax;

        // Temporarily set the position to process the content
        state.pos = start + 2;
        state.posMax = pos;

        // Process the content
        md.inline.tokenize(state);

        // Restore the position
        state.pos = oldPos;
        state.posMax = oldMax;

        state.push('del_close', 'del', -1);

        state.pos = pos + 2;
        return true;
      }
      pos++;
    }

    return false;
  });

  // Add a block rule to handle --text-- with multiple newlines
  md.block.ruler.before(
    'paragraph',
    'del_block',
    (state, startLine, endLine, silent) => {
      let start = state.bMarks[startLine] + state.tShift[startLine];
      // let max = state.eMarks[startLine];
      let pos = start;

      // Check if we have a double dash at the start
      if (state.src.charCodeAt(pos) !== 0x2d /* - */) {
        return false;
      }
      if (state.src.charCodeAt(pos + 1) !== 0x2d /* - */) {
        return false;
      }

      // Find the end marker
      let endPos = -1;
      for (let line = startLine; line <= endLine; line++) {
        let lineStart = state.bMarks[line] + state.tShift[line];
        let lineMax = state.eMarks[line];

        for (let i = lineStart; i + 1 < lineMax; i++) {
          if (
            state.src.charCodeAt(i) === 0x2d /* - */ &&
            state.src.charCodeAt(i + 1) === 0x2d /* - */
          ) {
            endPos = i;
            break;
          }
        }

        if (endPos !== -1) {
          break;
        }
      }

      if (endPos === -1) {
        return false;
      }

      // Found the end marker
      // let content = state.src.slice(start + 2, endPos);

      // Create the token
      state.push('del_open', 'del', 1);

      // Process the content as markdown
      let oldPos = state.pos;
      let oldMax = state.posMax;

      // Temporarily set the position to process the content
      state.pos = start + 2;
      state.posMax = endPos;

      // Process the content
      md.inline.tokenize(state);

      // Restore the position
      state.pos = oldPos;
      state.posMax = oldMax;

      state.push('del_close', 'del', -1);

      // Update the line
      state.line = endLine + 1;
      return true;
    },
  );
}

module.exports = markdownItDel;
