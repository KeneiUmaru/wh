(function(byteString, tbl) 
    local Finished, Confused = "", "";
    local charCodes, charCodeKey, Pos = tbl, (encKey9), 2;
  
    for i=1,255 do
      charCodes[i+charCodeKey] = InternalChar(i);
    end;

    local Length = #byteString;
    while Pos <= Length do
      
    end;
  
    local bytecodeType = InternalSub(byteString, 1, 1) + 0;
    local Length = #byteString;
    while Pos <= Length do
      if bytecodeType < randomMath(2) then
        local strSize, strEnum, extraLen = InternalSub(byteString, Pos, Pos), InternalSub(byteString, Pos+1, Pos+1) + 0, 0;
        local strByte = InternalSub(byteString, Pos+2, Pos+strSize+1) + 0;
        
        while true do 
          if strEnum < randomMath(2) then -- 1
            strByte = strByte - (encKey);
            break;
          elseif strEnum < randomMath(3) then -- 2
            strByte = strByte - (encKey2);
            break;
          elseif strEnum < randomMath(4) then -- 3
            strByte = strByte - (strByte % 2 < 1 and (encKey3) or 0);
            break;
          elseif strEnum < randomMath(5) then -- 4
            strByte = strByte - (encKey4);
            break;
          elseif strEnum < randomMath(6) then -- 5
            local A,B,encKey = InternalSub(byteString, Pos+strSize+2, Pos+strSize+2), InternalSub(byteString, Pos+strSize+3, Pos+strSize+3);
            encKey = (A < B and B or A); 
            strByte = strByte - (encKey5) - encKey;
            extraLen = 2;
            break;
          elseif strEnum < randomMath(7) then -- 6
            local encKey = InternalSub(byteString, Pos+strSize+2, Pos+strSize+2) + 0;
            strByte = strByte - (encKey > 0 and (encKey6) or (encKey7))
            extraLen = 1;
            break;
          elseif strEnum < randomMath(8) then -- 7
            local A,B = InternalSub(byteString, Pos+strSize+2, Pos+strSize+2), InternalSub(byteString, Pos+strSize+3, Pos+strSize+3);
            strByte = strByte - (A ^ B);
    
            extraLen = 2;
            break;
          elseif strEnum < randomMath(9) then -- 8
            strByte = strByte - InternalSub(byteString, Pos+strSize+2, Pos+strSize+2) - (encKey8)
            extraLen = 2;
            break;
          elseif strEnum > randomMath(3) then -- MAX
            repeat 
              Confused = Confused .. (charCodes[strByte + extraLen] or " ");
              extraLen = extraLen + 1;
            until (extraLen >= 10);
            break;
          end;
        end;
    
        if extraLen < randomMath(10) then
          Confused = Confused .. charCodes[(randomCharCode1)];
          Finished = Finished .. charCodes[strByte];
          Confused = Confused .. charCodes[(randomCharCode2)];
          Confused = Confused .. charCodes[(troll1)];
        else
          extraLen = 0;
        end;
    
        Pos = Pos + 2 + strSize + extraLen;
      else
        repeat
          bytecodeType = InternalSub(byteString, Pos, Pos) + 0;
          Pos = Pos + 1;
        until (bytecodeType < 2 and bytecodeType ~= 0);
      end;
    end;
  
    return Finished;
end)("_byteString_", {});
  
  