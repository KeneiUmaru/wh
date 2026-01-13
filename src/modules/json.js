function IsFloat(n) {
    return Number(n) === n && n % 1 !== 0;
}

function shuffleObjectKeys(obj) {
    const keys = Object.keys(obj);
    for (let i = keys.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [keys[i], keys[j]] = [keys[j], keys[i]]; // Swap elements
    }

    const shuffledObj = {};
    for (const key of keys) {
        shuffledObj[key] = obj[key];
    }
    return shuffledObj;
}

function Encode(object, config) {
    object = shuffleObjectKeys(object);
    const Stream = [];

    function writeInt(int) {
        Stream.push(int.toString().length, int);
    }

    function writeGbits8(byte) {
        Stream.push(byte);
    }

    function writeString(string) {
        writeInt(string.length);
        string.split("").forEach(char => writeInt(char.charCodeAt()));
    }

    function writeNumber(number) {
        writeInt(number);
    }
    
    function writeChunk(object) {
        writeInt(Object.values(object).length);
        writeString(Math.floor(Date.now() / 1000).toString());
        for (let [i,v] of Object.entries(object)) {
            switch (typeof(i)) {
                case "string":
                    writeInt(config.JSON_STRING_OP); // string header
                    writeString(i);
                    break
                case "number":
                    if (IsFloat(i) || i < 0) {
                        writeInt(config.JSON_FLOAT_OP);
                        writeString(i.toString());
                        break;
                    }

                    writeInt(config.JSON_INT_OP); // number header
                    writeNumber(i)
            }
    
            switch (typeof(v)) {
                case "string":
                    writeInt(config.JSON_STRING_OP); // string header
                    writeString(v);
                    break;
                case "number":
                    if (IsFloat(v) || v < 0) {
                        writeInt(config.JSON_FLOAT_OP);
                        writeString(v.toString());
                        break;
                    }

                    writeInt(config.JSON_INT_OP); // number header
                    writeNumber(v);
                    break;
                case "object":
                    writeInt(config.JSON_OBJ_OP) // object header
                    writeChunk(v);
                    break;
                case "boolean":
                    writeInt(config.JSON_BOOL_OP);
                    writeGbits8(v == true ? 1 : 0);
            }
        }
    }

    writeChunk(object);
    return Stream.join("");
}

module.exports = Encode;