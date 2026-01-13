for i,v in PROXY do
    if i == "RETURN_ITER_KEY" then
        break;
    end;
end;

-- LEN CHECK
if #PROXY ~= 1 then
    while true do end;
end;

if PROXY > PROXY and PROXY >= PROXY then
    while true do end;
end;

if PROXY["PROXY_INDEX_KEY"] ~= "RETURN_INDEX_KEY" then
    while true do end;
end;

PROXY["PROXY_NEWINDEX_KEY_1"]="PROXY_NEWINDEX_KEY_2";

if PROXY("CALL_KEY") ~= "RETURN_CALL_KEY" then
    while true do end;
end;

if PROXY + "ADD_KEY" ~= "RETURN_ADD_KEY" then
    while true do end;
end;

if PROXY .. "CONCAT_KEY" ~= "RETURN_CONCAT_KEY" then
    while true do end;
end;

if PROXY - "SUB_KEY" ~= "RETURN_SUB_KEY" then
    while true do end;
end;