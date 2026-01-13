(function(input) 
    local Length, Pos, Output, Chars = #input, OBFUSCATE_INT(1), "", {};
    while Pos <= OBFUSCATE_INT(255) do
        Chars[Pos + REBASE_CHAR] = InternalCharCodes[Pos];
        Pos = Pos + OBFUSCATE_INT(1);
    end;
    Pos = OBFUSCATE_INT(1);
    while Pos <= Length do
        local Length = InternalSub(input, Pos, Pos);
        local Byte = InternalSub(input, Pos + OBFUSCATE_INT(1), Pos + Length);
        Output = Output .. Chars[(Byte - REBASE) - ADDITION];
        Pos = Pos + OBFUSCATE_INT(1) + Length;
    end;
    return Output;
end)(BYTECODE)