const OPERATOR = "operator";
const YE = "ई";
const BOL = "बोलऽ";
const KEYWORD = "keyword";
const NUMBER = "number";
const PRINT = "Print";
const PROGRAM = "Program";
const DECLARATION = "Declaration";
const IDENTIFIER = "identifier";

// Precompile regex and use sets for faster lookup
const whitespace = /\s/;
const alphabetic = /[a-zA-Z\u0900-\u097F]/; // Only alphabetic characters, including Hindi
const alphanumeric = /[a-zA-Z\u0900-\u097F0-9]/; // Alphanumeric characters, including Hindi
const digit = /\d/; // Digits
const keywords = new Set([YE, BOL]);
const operators = new Set(['+', '-', '*', '/', '=']);

function lexar(input) {
  const tokens = [];
  let cursor = 0;

  while (cursor < input.length) {
    let char = input[cursor];

    if (whitespace.test(char)) {
      cursor++;
      continue;
    }

    if (alphabetic.test(char)) {
      let word = "";
      while (cursor < input.length && alphanumeric.test(input[cursor])) {
        word += input[cursor++];
      }

      if (keywords.has(word)) {
        tokens.push({ type: KEYWORD, value: word });
      } else {
        tokens.push({ type: IDENTIFIER, value: word });
      }

      continue;
    }

    if (digit.test(char)) {
      let num = "";
      while (cursor < input.length && digit.test(input[cursor])) {
        num += input[cursor++];
      }
      tokens.push({ type: NUMBER, value: parseInt(num, 10) });
      continue;
    }

    if (operators.has(char)) {
      tokens.push({ type: OPERATOR, value: char });
      cursor++;
      continue;
    }

    cursor++;  // Skip unrecognized characters
  }

  return tokens;
}

function parser(tokens) {
  const ast = {
    type: PROGRAM,
    body: [],
  };

  while (tokens.length > 0) {
    let token = tokens.shift();

    if (token.type === KEYWORD) {
      if (token.value === YE) {
        let declaration = {
          type: DECLARATION,
          name: tokens.shift().value,
          value: null,
        };

        if (tokens[0]?.type === OPERATOR && tokens[0].value === "=") {
          tokens.shift();
          let expression = "";
          while (tokens.length > 0 && tokens[0].type !== KEYWORD) {
            expression += tokens.shift().value;
          }
          declaration.value = expression.trim();
        }
        ast.body.push(declaration);
      }

      if (token.value === BOL) {
        ast.body.push({
          type: PRINT,
          expression: tokens.shift().value,
        });
      }
    }
  }
  return ast;
}

function codeGen(node) {
  switch (node.type) {
    case PROGRAM:
      return node.body.map(codeGen).join("\n");
    case DECLARATION:
      return `let ${node.name} = ${node.value};`;
    case PRINT:
      return `console.log(${node.expression});`;
  }
}

function safeRunner(code) {
  // Create a new function to safely execute the code
  new Function(code)();
}

function compiler(input) {
  const tokens = lexar(input);
  const ast = parser(tokens);
  const executableCode = codeGen(ast);
  safeRunner(executableCode);
}

const code = `
ई x = 190
ई y = 20
ई z = 0
ई a = 206
ई sum = x + y * z + a
बोलऽ sum
`;
compiler(code);
