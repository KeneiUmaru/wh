local PROXY = newproxy(true);
local mt = getmetatable(PROXY);
mt.__metatable = {}

mt.__tostring = function() 
    while true do end;
end;

mt.__iter = function(self) 
    if PROXY ~= self then
        while true do end;
    end;
    return function() 
        return "RETURN_ITER_KEY"
    end
end

mt.__len = function(self) -- ONLY RETURN NUMBER
    if PROXY ~= self then
        while true do end;
    end;
    return 1 -- RETURN LEN KEY
end;

mt.__lt = function(left, right) -- ONLY RETURN BOOLEAN
    if left ~= right then
        while true do end;
    end;
end;

mt.__le = function(left, right) -- ONLY RETURN BOOLEAN
    if left ~= right then
        while true do end;
    end;
end;

mt.__index = function(self, idx) 
    if self ~= PROXY then
        while true do end;
    end;
    if idx == "PROXY_INDEX_KEY" then
        return "RETURN_INDEX_KEY"
    end;
    while true do end;
end;

mt.__newindex = function(self, idx, value) 
    if self ~= PROXY then
        while true do end;
    end;
    if idx == "PROXY_NEWINDEX_KEY_1" and value == "PROXY_NEWINDEX_KEY_2" then
        return true;
    end;
    while true do end;
end;

mt.__call = function(self, key)
    if self ~= PROXY then
        while true do end
    end;
    if key == "CALL_KEY" then
        return "RETURN_CALL_KEY"
    end;
    while true do end;
end;

mt.__namecall = function(self, key) 
    if self ~= PROXY then
        while true do end
    end;
    if key == "NAMECALL_KEY" then
        return "RETURN_NAMECALL_KEY"
    end;
end;

mt.__add = function(self, key) 
    if self ~= PROXY then
        while true do end
    end;
    if key == "ADD_KEY" then
        return "RETURN_ADD_KEY"
    end;
    while true do end;
end;

mt.__concat = function(self, key)
    if self ~= PROXY then
        while true do end
    end;
    if key == "CONCAT_KEY" then
        return "RETURN_CONCAT_KEY"
    end;
    while true do end;
end;

mt.__sub = function(self, key) 
    if self ~= PROXY then
        while true do end
    end;
    if key == "SUB_KEY" then
        return "RETURN_SUB_KEY"
    end;
    while true do end;
end;
