const opcode_map = {
    "mov": 1,
    "loadk": 2,
    "loadglobal": 3,
    "call": 4,
    "settable": 5,
    "newtable": 6,
    "pop": 7,
    "return": 8,
    "eq": 9,
    "jeq": 10,
    "stacktop": 11,
    "getlicensekey": 12,
    "jmp": 13,
    "gethwid": 14,
    "getresposeindex": 15
}

function parse(input, config) {
    const lines = input.split("\n");
    const instructions = [];
    const virtual_stack = [];

    for (let [index, line] of Object.entries(lines)) {
        if (!line.trim().length)
            continue;

        line = line.trim();

        // Remove Comments
        for (let i=0; i < line.length; i++) {
            let character = line.charAt(i);
            if (character == "#") {
                line = line.substr(0, i);
                continue;
            }
        }

        const data = line.split(" ");
        const opcode = data.shift();
        
        switch (opcode) {
            case "mov": { // mov R{number}, R{number}
                const register = data.shift();
                if (!register.startsWith("R"))
                    throw `Compiler: Invalid register (${register}) (line ${index})`

                let location;
                let to;

                if (register.endsWith(",")) {
                    location = +register.substr(1).substr(0, register.length - 2);
                } else {
                    location = +register.substr(1);
                }

                const move = data.join("")
                if (move.startsWith("R")) {
                    to = +move.substr(1).substr(0, move.length - 1);
                } else {
                    throw `mov: Invalid register (${move}) (line ${index})`
                }

                instructions.push({ opcode: opcode_map[opcode], a: location, b: to });
                virtual_stack[location] = virtual_stack[to];
                break;
            }
            case "loadglobal": { // loadglobal R{number}, R{number}
                const register = data.shift();
                if (!register.startsWith("R"))
                    throw `loadglobal: Invalid register (${register}) (line ${index})`

                let location;
                let to;

                if (register.endsWith(",")) {
                    location = +register.substr(1).substr(0, register.length - 2);
                } else {
                    location = +register.substr(1);
                }

                const move = data.join("")
                if (move.startsWith("R")) {
                    to = +move.substr(1).substr(0, move.length - 1);
                } else {
                    throw `loadglobal: Invalid register (${move}) (line ${index})`
                }

                if (typeof(virtual_stack[to]) !== "string")
                    throw `loadglobal: Expected string, got ${typeof(virtual_stack[to])}`;

                if (!globalThis[virtual_stack[to]])
                    throw `loadglobal: Invalid global ${virtual_stack[to]}`

                instructions.push({ opcode: opcode_map[opcode], a: location, b: to });
                virtual_stack[location] = globalThis[virtual_stack[to]];
                break;
            }
            case "loadk": { // loadk R{number}, {constant}
                const register = data.shift();
                if (!register.startsWith("R"))
                    throw `loadk: Invalid register (${register}) (line ${index})`

                let location;
                let constant;

                if (!register.endsWith(","))
                    throw `loadk: expects data`

                location = +register.substr(1).substr(0, register.length - 2);

                const move = data.join(" ")
                if (move.startsWith("\"")) {
                    if (!move.endsWith("\""))
                        throw `Syntax Error: loadk: Unfinished string (line ${index})`;

                    constant = move.substr(1).substr(0, move.length - 2);
                } else {
                    constant = +move;
                }

                instructions.push({ opcode: opcode_map[opcode], a: location, b: constant });
                virtual_stack[location] = constant;
                break;
            }
            case "call": { // call R{number}, {number of args} | Stack[Top - {number of args}]
                const register = data.shift();
                if (!register.startsWith("R"))
                    throw `call: Invalid register (${register}) (line ${index})`

                let location;
                let args;

                if (!register.endsWith(","))
                    throw `call: expects data`

                location = +register.substr(1).substr(0, register.length - 2);

                const move = data.join(" ")
                if (isNaN(parseInt(move))) 
                    throw "call: arg2 should be number";

                args = +move;

                if (typeof(virtual_stack[location]) !== "function")
                    throw `call: arg1 expected function got ${typeof(virtual_stack[location])}`;

                let virtual_args = [];
                for (let i=virtual_stack.length; i > virtual_stack.length - args; i--) {
                    virtual_args.push(virtual_stack[i - 1]);
                }

                console.log(virtual_args);

                virtual_stack[location] = virtual_stack[location](...virtual_args);
                instructions.push({ opcode: opcode_map[opcode], a: location, b: args });
                break;
            }
            case "newtable": { // newtable R{number}
                const register = data.shift();
                if (!register.startsWith("R"))
                    throw `newtable: Invalid register (${register}) (line ${index})`

                let location;

                if (register.endsWith(","))
                    throw `newtable: doesn't need 2nd arg`

                location = +register.substr(1);

                virtual_stack[location] = {};
                instructions.push({ opcode: opcode_map[opcode], a: location, b: 0 });
                break;
            }
            case "getlicensekey": {
                const register = data.shift();
                if (!register.startsWith("R"))
                    throw `getlicensekey: Invalid register (${register}) (line ${index})`

                let location;

                if (register.endsWith(","))
                    throw `getlicensekey: doesn't need 2nd arg`

                location = +register.substr(1);

                virtual_stack[location] = {};
                instructions.push({ opcode: opcode_map[opcode], a: location, b: 0 });
                break;
            }
            case "gethwid": {
                const register = data.shift();
                if (!register.startsWith("R"))
                    throw `gethwid: Invalid register (${register}) (line ${index})`

                let location;

                if (register.endsWith(","))
                    throw `gethwid: doesn't need 2nd arg`

                location = +register.substr(1);

                virtual_stack[location] = {};
                instructions.push({ opcode: opcode_map[opcode], a: location, b: 0 });
                break;
            }
            case "getresposeindex": {
                const register = data.shift();
                if (!register.startsWith("R"))
                    throw `getresposeindex: Invalid register (${register}) (line ${index})`

                let location;
                let constant;

                if (!register.endsWith(","))
                    throw `getresposeindex: expects data`

                location = +register.substr(1).substr(0, register.length - 2);

                const move = data.join(" ")
                if (move.startsWith("\"")) {
                    if (!move.endsWith("\""))
                        throw `Syntax Error: loadk: Unfinished string (line ${index})`;

                    constant = move.substr(1).substr(0, move.length - 2);
                } else {
                    constant = +move;
                }

                instructions.push({ opcode: opcode_map[opcode], a: location, b: constant });
                virtual_stack[location] = constant;
                break;
            }
            case "settable": { // settable R{number}, {number}
                const register = data.shift();
                if (!register.startsWith("R"))
                    throw `settable: Invalid register (${register}) (line ${index})`

                let location;
                let args;

                if (!register.endsWith(","))
                    throw `settable: expects data`

                location = +register.substr(1).substr(0, register.length - 2);

                const move = data.join(" ")
                if (isNaN(parseInt(move))) 
                    throw "settable: arg2 should be number";

                args = +move;

                if (typeof(virtual_stack[location]) !== "object")
                    throw `settable: arg1 expected object got ${typeof(virtual_stack[location])}`;

                let tbl = virtual_stack[location];
                for (let i=virtual_stack.length; i > virtual_stack.length - args; i-=2) {
                    tbl[virtual_stack[i - 2]] = virtual_stack[i - 1];
                }

                virtual_stack[location] = tbl;
                instructions.push({ opcode: opcode_map[opcode], a: location, b: args });
                break;
            } 
            case "pop": {  // pop {number}
                const amount = data.shift();
                if (isNaN(parseInt(amount))) 
                    throw "pop: arg1 should be number";

                //console.log("NIGGA", virtual_stack, virtual_stack.length - +amount)
                for (let i=virtual_stack.length; i > virtual_stack.length - +amount - 1; i--) { // DOESNT NEED -1 for lua
                    delete virtual_stack[i];
                }
                console.log(virtual_stack);
                instructions.push({ opcode: opcode_map[opcode], a: +amount, b: 0 });
                break;
            }
            case "eq": {
                const register = data.shift();
                if (!register.startsWith("R"))
                    throw `eq: Invalid register (${register}) (line ${index})`

                let location;
                let to;

                if (register.endsWith(",")) {
                    location = +register.substr(1).substr(0, register.length - 2);
                } else {
                    location = +register.substr(1);
                }

                const move = data.join("")
                if (move.startsWith("R")) {
                    to = +move.substr(1).substr(0, move.length - 1);
                } else {
                    throw `eq: Invalid register (${move}) (line ${index})`
                }

                instructions.push({ opcode: opcode_map[opcode], a: location, b: to });
                virtual_stack[virtual_stack.length] = virtual_stack[location] == virtual_stack[to];
                break
            }
            case "jeq": {
                const amount = data.shift();
                if (isNaN(parseInt(amount))) 
                    throw "jeq: arg1 should be number";

                instructions.push({ opcode: opcode_map[opcode], a: +amount, b: 0 });
                break
            }
            case "jmp": {
                const amount = data.shift();
                if (isNaN(parseInt(amount))) 
                    throw "jeq: arg1 should be number";

                instructions.push({ opcode: opcode_map[opcode], a: +amount, b: 0 });
                break
            }
            case "stacktop": {
                const register = data.shift();
                if (!register.startsWith("R"))
                    throw `stacktop: Invalid register (${register}) (line ${index})`

                let location;

                if (register.endsWith(","))
                    throw `stacktop: doesn't need 2nd arg`

                location = +register.substr(1);

                virtual_stack[location] = virtual_stack.length + 1;
                instructions.push({ opcode: opcode_map[opcode], a: location, b: 0 });
                break
            }
            case "stackdump": {
                console.log(virtual_stack);
                break;
            }
            default:
                break;
        }

        //console.log(line, virtual_stack)
    }

    instructions.push({ opcode: opcode_map["return"], a: 0, b: 0 });

    const tbl = {}
    let count = 1;
    for (const instr of instructions) {
        instr[config._RESPONSE_TOKEN_INDEX] = config._UNIQUETOKEN;
        instr[config._OPCODE_INDEX] = instr.opcode;
        instr[config._A_REGISTER] = instr.a;
        instr[config._B_REGISTER] = instr.b;

        delete instr.a;
        delete instr.b;
        delete instr.opcode;

        tbl[count] = instr;
        count++;
    }

    tbl[config._RESPONSE_TOKEN_INDEX]  = config._UNIQUETOKEN;
    return tbl;
}

module.exports = parse;