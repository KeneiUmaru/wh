local A,B = InternalSub(byteString, Pos+strSize+2, Pos+strSize+2), InternalSub(byteString, Pos+strSize+3, Pos+strSize+3);
strByte = strByte - (A ^ B);

extraLen = 2;