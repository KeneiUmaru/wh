const { readFileSync } = require("fs");
const path = require("path");
const { Minify } = require("../../luamin");
const { Random } = require("random");
const random = new Random();

function GenerateBytecode(input, { Addition, Rebase, RebaseChar }) {
    let Bytecode = "";
    for (const char of input.split("")) {
        const New = ((char.charCodeAt() + Addition) + Rebase) + RebaseChar;
        Bytecode += `${New.toString().length}${New}`;
    }
    return Bytecode;
}

/*
function generateExtraBytestring() {
  const extraByteString = [];
  for (let i=1; i <= Math.floor(Math.random() * 10 + 1); i++) {
    extraByteString.push(i.toString());
  };
  return extraByteString.reverse().join("");
};

function generateByteString(input, keys) {
  let byteString  = "";
  const charCodeKey = keys[8];
  byteString += generateExtraBytestring();


  input.split("").forEach(char => {
    const charCode = char.charCodeAt()+charCodeKey;
    const Enum     = Math.floor(Math.random() * 8 + 1);

    switch (Enum) {
      case 1: {
        let newCharCode = charCode+keys[0];
        byteString += `${newCharCode.toString().length}${Enum}${newCharCode}`;
        break;
      };
      case 2: {
        let newCharCode = charCode+keys[1];
        byteString += `${newCharCode.toString().length}${Enum}${newCharCode}`;
        break;
      };
      case 3: {
        let newCharCode = charCode;
        if (newCharCode % 2 < 1) {
          newCharCode = charCode + keys[2];
        };
        byteString += `${newCharCode.toString().length}${Enum}${newCharCode}`;
        break;
      };
      case 4: {
        let newCharCode = charCode+keys[3];
        let fakeCharCode = Math.floor(Math.random() * 253 + 1)+charCodeKey;
        byteString += `${newCharCode.toString().length}${Enum}${newCharCode}${fakeCharCode.toString().length}9${fakeCharCode}`;
        break;
      };
      case 5: {
        let A = Math.floor(Math.random() * 9 + 1);
        let B = Math.floor(Math.random() * 9 + 1);
        let encKey = 0;

        if (A < B) {
          encKey = B;
        } else {
          encKey = A;
        };

        let newCharCode = charCode+keys[4]+encKey;

        byteString += `${newCharCode.toString().length}${Enum}${newCharCode}${A}${B}`; 
        break;
      };
      case 6: {
        let encKey = Math.floor(Math.random() * 2) == 1 ? 1 : 0

        newCharCode = charCode+(encKey == 1 ? keys[5] : keys[6]);
        byteString += `${newCharCode.toString().length}${Enum}${newCharCode}${encKey}`; 
        break;
      };
      case 7: {
        let A = Math.floor(Math.random() * 9 + 1);
        let B = Math.floor(Math.random() * 9 + 1);

        newCharCode = charCode+(Math.pow(A,B));
        byteString += `${newCharCode.toString().length}${Enum}${newCharCode}${A}${B}`; 
        break;
      };
      case 8: {
        let encKey = Math.floor(Math.random() * 9 + 1);
        let fakeCharCode = Math.floor(Math.random() * 253 + 1)+charCodeKey;
        let fakeEnum = Math.floor(Math.random() * 9 + 1);

        newCharCode = charCode+encKey+keys[7];

        byteString += `${newCharCode.toString().length}${Enum}${newCharCode}${encKey}${fakeEnum}${fakeCharCode.toString().length}9${fakeCharCode}`;
        break;
      };
    };
  });

  return {
    bytecode: byteString
  };
};

    function generateMath(numb) {
      const Key = Math.floor(Math.random() * 999 + 1);
      return `(${numb+Key}-((${Key/2} * (_INTERNALMATHVAR + 1))))`;
    };
*/

module.exports = function(input) {
    const Keys = {
        Addition: random.int(1, 500),
        Rebase: random.int(1, 500),
        RebaseChar: random.int(1, 999)
    }

    const Bytecode = GenerateBytecode(input, Keys);

    let BaseScript = readFileSync(path.join(__dirname, "base2.lua"), "utf-8");
    BaseScript = BaseScript.replace(/REBASE_CHAR/, `OBFUSCATE_INT(${Keys.RebaseChar})`);
    BaseScript = BaseScript.replace(/REBASE/, `OBFUSCATE_INT(${Keys.Rebase})`);
    BaseScript = BaseScript.replace(/ADDITION/, `OBFUSCATE_INT(${Keys.Addition})`);
    BaseScript = BaseScript.replace(/BYTECODE/, `"${Bytecode}"`);

    return Minify(BaseScript, {
        RenameVariables: true
    });
}