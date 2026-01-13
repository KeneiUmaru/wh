local A,B,encKey = InternalSub(byteString, Pos+strSize+2, Pos+strSize+2), InternalSub(byteString, Pos+strSize+3, Pos+strSize+3);
encKey = (A < B and B or A); 
strByte = strByte - (encKey5) - encKey;
extraLen = 2;