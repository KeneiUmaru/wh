local function LS_CF(f) return f() end; 
local function LS_CFINNER(f) return f() end;
local function LS_ENCSTR(r) return r; end;
local function OBFUSCATE_INT(r) return r; end;
local function LS_HIDEGLOBAL(r) return r; end;
local function LS_PROXY() end;
local function LS_PROXY_CHECK() end;
local function LS_RANDOMISE(f) return f() end;
local _INTERNALMATHVAR = #(" ");

local _env = getfenv(0);
local InternalSub = ("").sub;
local InternalChar = ("").char;
local InternalCharCodes = {};
for i=1,255 do
  InternalCharCodes[i] = InternalChar(i);
end;

--#TEMPVARS

LS_CF(function()
  local ResponseBody;
  local ResponseHeaders;
  local LicenseKey;
  local print;
  (function(...) end)(LS_ENCSTR("DSF Says Hello!"))
end)

LS_CF(function() 
  print = not AUTH_SILENT_LAUNCH and LS_HIDEGLOBAL(print) or function() end;
  print(LS_ENCSTR("[*] This script was licensed using Secure Lua | securelua.com"));  
end)

local Notify;

if script_key then
  LicenseKey = script_key;
else
  if not game or not Instance then return print(LS_ENCSTR("[*] You need to define a License Key. Example: script_key='Key Here'")) end;
  if AUTH_SILENT_LAUNCH then return end;

  LS_IMPORT("GUI.lua")
end;

local request = LS_HIDEGLOBAL(request);
local game = LS_HIDEGLOBAL(game);
local HWID = "";

LS_CF(function() 
  local JSONDecode;
  local ProtectedTable;
  
  local table = LS_HIDEGLOBAL(table);
  local debug = LS_HIDEGLOBAL(debug);
  local string = LS_HIDEGLOBAL(string);
  local info = debug[LS_ENCSTR("info")];
  local freeze = table[LS_ENCSTR("freeze")];
  local setmetatable = LS_HIDEGLOBAL(setmetatable);
  local getmetatable = LS_HIDEGLOBAL(getmetatable);
  local sub = string[LS_ENCSTR("sub")];
  local find = string[LS_ENCSTR("find")];
  local xpcall = LS_HIDEGLOBAL(xpcall);
  local pcall = LS_HIDEGLOBAL(pcall);
  local newproxy = LS_HIDEGLOBAL(newproxy);
  local os = LS_HIDEGLOBAL(os);
  local time = os[LS_ENCSTR("time")];
  local clock = os[LS_ENCSTR("clock")];
  local date = os[LS_ENCSTR("date")];
  local coroutine = LS_HIDEGLOBAL(coroutine);
  local tostring = LS_HIDEGLOBAL(tostring);
  local sunpack = string[LS_ENCSTR("unpack")];
  local coroutine_running = coroutine[LS_ENCSTR("running")];
  local coroutine_isyieldable = coroutine[LS_ENCSTR("isyieldable")];
  local math_random = math.random;
  local Timestamp = clock();
  
  AUTH_START = time();
end)

local RequestFunction;
if request then
  RequestFunction = request;
elseif game then
  if Notify then
    Notify(LS_ENCSTR("Failed!"), LS_ENCSTR("Failed to verify response signature"))
  end;
  return print(LS_ENCSTR("[*] Unsupported exploit, create a ticket in our server (discord.com/invite/5HZNmQV7Yr)"));
else
  RequestFunction = require(LS_ENCSTR("@lune/net")).request;
end;

LS_CF(function() 
  local URL = LS_ENCSTR("http://127.0.0.1:8081/") .. LS_ENCSTR("auth/headers");
  local FormulatedBody = {};
  FormulatedBody[LS_ENCSTR("Url")] = URL;
  FormulatedBody[LS_ENCSTR("url")] = URL;
  
  ResponseBody = RequestFunction(FormulatedBody);
  ResponseHeaders = ResponseBody[LS_ENCSTR("headers")] or ResponseBody[LS_ENCSTR("Headers")];
  ResponseBody = ResponseBody[LS_ENCSTR("body")] or ResponseBody[LS_ENCSTR("Body")];
  
  --[[
  ResponseBody = ResponseBody:lower():gmatch("\"%g*\": \"%g*\"");
  while true do 
    local header = ResponseBody();
    print(header);
    if not header or #header == 0 then
      break
    else
      if header:find("fingerprint") then
        local x, value = table.unpack(header:split(": "));
        HWID = value:sub(0, -2):sub(2);
      end;
    end;
  end;
  ]]
end)

-- Timer begins on the server, so if we catch them before the next request, blacklist.
local ErrorCount = 0;
do
  LS_RANDOMISE(function() 
    xpcall(info, function(er) 
      ErrorCount = ErrorCount + 1;
    end, -2);
  
    xpcall(math_random, function(er) 
      ErrorCount = ErrorCount + 1;
    end, {});
  
    xpcall(error, function(er) 
      ErrorCount = ErrorCount + 1;
    end);
  
    xpcall(sub, function(er) 
      ErrorCount = ErrorCount + 1;
    end, {});
  
    xpcall(time, function(er) 
      ErrorCount = ErrorCount + 1;
    end, -1);
  
    xpcall(time, function(er) 
      ErrorCount = ErrorCount + 1;
    end, {});
  
    xpcall(xpcall, function(er) 
    end, function() 
      error()
    end, function(er) 
      ErrorCount = ErrorCount + 1;
    end);
  
    do
      local x = math.random();
      if typeof(x) == "table" then
        while true do end;
      end;
      if x > 1 then
        while true do end;
      end;
      x = math_random(0, 1000);
      if x > 1000 then
        while true do end;
      end;
      x = time();
      if typeof(x) == "table" then
        while true do end;
      end;
      x = clock();
      if typeof(x) == "table" then
        while true do end;
      end;
      ErrorCount = ErrorCount + 1;
    end
  
    xpcall(RequestFunction, function(err) 
      ErrorCount = ErrorCount + 1;
    end);
  
    xpcall(RequestFunction, function(err) 
      ErrorCount = ErrorCount + 1;
    end, {});
  
    do
      local mt = setmetatable({}, {
        __metatable = {};
      });
      xpcall(table.freeze, function(er) 
        ErrorCount = ErrorCount + 1;
      end, mt);
      xpcall(getmetatable, function(er) 
        ErrorCount = ErrorCount + 1;
      end);
      if getmetatable(math_random) then
        while true do end;
      end;
    end

    xpcall(tostring, function(er) 
      ErrorCount = ErrorCount + 1;
    end)
  end)
end;

-- Luraph Anti-Tamper / Average Anti-Beautify
do
  LS_CF(function() 
    local TemporaryProxy = newproxy(true);
    local TemporaryProxyMT = getmetatable(TemporaryProxy);
    local LineString = LS_ENCSTR("l");
    local CallLine, LengthLine;
  
    TemporaryProxyMT[LS_ENCSTR("__call")] = function() 
      CallLine = info(OBFUSCATE_INT(2), LineString);
    end;
  
    TemporaryProxyMT[LS_ENCSTR("__len")] = function() 
      LengthLine = info(OBFUSCATE_INT(2), LineString);
      return OBFUSCATE_INT(1);
    end;
  
    CallLine = #TemporaryProxy;
    TemporaryProxy();
  
    if CallLine ~= LengthLine then
      while true do end;
    end;
  end)
end;

LS_CF(function() 
  if ErrorCount > OBFUSCATE_INT(13) then
    while true do end;
  end;
  
  if ErrorCount < OBFUSCATE_INT(13) then
    while true do end;
  end;
end)

ErrorCount = 0;

local temp = {};

for i=1, #ResponseBody do
  local char, pointer = sub(ResponseBody, i, i);
  if char == "\"" then
    for x=i + 1, #ResponseBody do
      local char2 = sub(ResponseBody, x, x);
      if char2 == "\"" then
        pointer = x;
        break;
      end;
    end;
    temp[#temp+1] = sub(sub(sub(ResponseBody, i, pointer), 2), 0, -2)
  end;
end;

for i=1, #temp, 4 do
  local header, value = temp[i], temp[i + 2];
  if find(header, LS_ENCSTR("fingerprint")) then
    HWID = value;
    break;
  end;
end;

LS_CF(function() 
  local Yes = date(LS_ENCSTR("%b %Y %M"));
  local d = sub(sub(ResponseHeaders[LS_ENCSTR("date")] or ResponseHeaders[LS_ENCSTR("Date")], 0, -8), 9);
  if sub(Yes, 0, -4) ~= sub(d, 0, -7) then
    while true do end;
  end;
end)

LS_CF(function() 
  LS_PROXY(1)
end)

local BackupTime = time();

local RNG;
local START_INTEGRITY_BASE;
do
  local function lcg(seed) 
    return (1664525 * seed + 1013904223) % 2^32;
  end;

  local initalseed = (OBFUSCATE_INT(_RNG_SEED)) + time() + clock() + math_random(1, 1000);
  local value = 0;
  local a,b;
  
  for i=1,1000 do
    LS_CF(function() 
      local seed = (OBFUSCATE_INT(_RNG_SEED)) + time() + clock() + math_random(1, 1000);
      
      LS_RANDOMISE(function() 
        if i == OBFUSCATE_INT(_RNG_INTERVAL_ONE) then
          a = lcg(seed + initalseed);
        end;
      
        if i == OBFUSCATE_INT(_RNG_INTERVAL_TWO) then
          b = lcg(seed + initalseed);
          START_INTEGRITY_BASE = b;
        end;
      end)

      value = value + lcg(seed + initalseed)
    end)
  end;

  if b == a then
    while true do end;
  end;


  RNG = value + b + a;
end;

local SlashCharacter = LS_ENCSTR("/");
local RunningThread = coroutine_running();
local RequestDebugName = info(RequestFunction, LS_ENCSTR("n"));
local RequestBody = {};
setmetatable(RequestBody, {});

local RequestProxy = newproxy(true);
local RequestProxyMT = getmetatable(RequestProxy);
RequestProxyMT[LS_ENCSTR("__metatable")] = {}
RequestProxyMT[LS_ENCSTR("__tostring")] = function() 
  while true do end;
end;

local RNGProxy = newproxy(true);
local RNGProxyMT = getmetatable(RNGProxy);
RNGProxyMT[LS_ENCSTR("__metatable")] = {};
RNGProxyMT[LS_ENCSTR("__tostring")] = function() 
  while true do end;
end

RNGProxyMT[LS_ENCSTR("__add")] = function(self, key) 
  if self ~= RNGProxy then
    while true do end;
  end;
  if key == OBFUSCATE_INT(LS_RANDOMINT("RNGAddKey")) then
    local function lcg(seed) 
      return (1664525 * seed + 1013904223) % 2^32;
    end;
  
    local initalseed = (OBFUSCATE_INT(_RNG_SEED)) + time() + clock() + math_random(1, 1000);
    local value = 0;
    local a,b;
    
    for i=OBFUSCATE_INT(1),OBFUSCATE_INT(1000) do
      local seed = (OBFUSCATE_INT(_RNG_SEED)) + time() + clock() + math_random(1, 1000);
        
      LS_RANDOMISE(function() 
        if i == OBFUSCATE_INT(_RNG_INTERVAL_ONE) then
          a = lcg(seed + initalseed);
        end;
      
        if i == OBFUSCATE_INT(_RNG_INTERVAL_TWO) then
          b = lcg(seed + initalseed);
        end;
      end)

      value = value + lcg(seed + initalseed)
    end;
  
    if b == a then
      while true do end;
    end;
    
    RNGProxyMT[LS_ENCSTR("__sub")] = function(self, key) 
      if self ~= RNGProxy then
        while true do end;
      end;
      if key == OBFUSCATE_INT(LS_RANDOMINT("RNGSUBKey")) then
        RNGProxyMT[LS_ENCSTR("__iter")] = function()
          return function() 
            return OBFUSCATE_INT(LS_RANDOMINT("RNGIterKey"))
          end;
        end;
        return value + b + a; 
      end;
      while true do end;
    end;
  end;
end;

local TostringProxy = newproxy(true);
do
  local TostringProxyMT = getmetatable(TostringProxy);
  TostringProxyMT[LS_ENCSTR("__metatable")] = {};
  TostringProxyMT[LS_ENCSTR("__tostring")] = function(self) 
    if self ~= TostringProxy then
      while true do end;
    end;
    local f = info(OBFUSCATE_INT(2), LS_ENCSTR("f"));
    if f ~= tostring then
      while true do end;
    end;
    return tostring({});
  end;
end;

-- This is possibly the biggest troll ever :lmfao:
RNGProxyMT[LS_ENCSTR("__mul")] = function(self, key) 
  if self ~= RNGProxy then
    while true do end;
  end;
  if key == OBFUSCATE_INT(LS_RANDOMINT("RNGMulKey")) then
    local value = sub(tostring(TostringProxy), 8);
    RNGProxyMT[LS_ENCSTR("__div")] = function(self) 
      if self ~= RNGProxy then
        while true do end;
      end;
      return value;
    end;
    return;
  end;
  while true do end;
end;

RNGProxyMT[LS_ENCSTR("__lt")] = function(self, key) 
  if self ~= RNGProxy then
    while true do end;
  end;
  if key == RNGProxy then
    local rng = sunpack(LS_ENCSTR("xxxxxxxxxxxxxxxxxxxx<I4"), tostring({}));
    RNGProxyMT[LS_ENCSTR("__concat")] = function(self) 
      if self ~= RNGProxy then
        while true do end;
      end;
      return rng;
    end;
    return;
  end;
  while true do end;
end;

local RequestIndexed;
local RequestIndexCount = 0;

do
  LS_CF(function() 
    local mt = getmetatable(RequestBody);
    mt[LS_ENCSTR("__metatable")] = {};
    mt[LS_ENCSTR("__tostring")] = function() while true do end; end;
    mt[LS_ENCSTR("__iter")] = function() while true do end; end
  end)

  mt[LS_ENCSTR("__index")] = function(self, idx) 
    if self ~= RequestBody then
      while true do end;
    end;
    if coroutine_isyieldable() then
      while true do end;
    end;
    if coroutine_running() ~= RunningThread then
      while true do end;
    end;
    local s, n = info(OBFUSCATE_INT(2), LS_ENCSTR("sn"));
    if s ~= LS_ENCSTR("[C]") then
      while true do end;
    end;
    if n ~= RequestDebugName and n ~= LS_ENCSTR("pcall") then
      while true do end;
    end;
    RequestProxyMT[LS_ENCSTR("__iter")] = function() 
      return function() 
        return OBFUSCATE_INT(_REQUEST_PROXY_INTER_KEY);
      end;
    end;
    RequestIndexed = true;
    if idx == LS_ENCSTR("Url") or idx == LS_ENCSTR("url") then
      RequestProxyMT[LS_ENCSTR("__len")] = function() 
        return OBFUSCATE_INT(_REQUEST_PROXY_LEN_KEY)
      end;
      (function()
        local x = RNGProxy > RNGProxy;
        return RNGProxy + OBFUSCATE_INT(LS_GETSTORAGE("RNGAddKey")), (RNGProxy * OBFUSCATE_INT(LS_GETSTORAGE("RNGMulKey"))), x;
      end)()
      RequestIndexCount = RequestIndexCount + 1;
      return LS_ENCSTR("http://127.0.0.1:8081/auth/") .. PROJECT_ID .. SlashCharacter .. LicenseKey .. SlashCharacter .. (RNG + OBFUSCATE_INT(_RNG_ADDITION_KEY)) .. SlashCharacter .. (RNGProxy - OBFUSCATE_INT(LS_GETSTORAGE("RNGSUBKey"))) .. SlashCharacter .. ((RNGProxy / 0) + 0) .. SlashCharacter .. (RNGProxy .. "");
    end;
  end;
end;

do
  local ok, err = pcall(request, setmetatable({}, {
    __metatable = {};
  }));

  if find(err, LS_ENCSTR("Not allowed")) then 
    LS_CF(function() 
      RequestBody = {};
      RequestProxyMT[LS_ENCSTR("__iter")] = function() 
        return function() 
          return OBFUSCATE_INT(_REQUEST_PROXY_INTER_KEY);
        end;
      end;
      RequestIndexed = true;
      RequestProxyMT[LS_ENCSTR("__len")] = function() 
        return OBFUSCATE_INT(_REQUEST_PROXY_LEN_KEY)
      end;
      (function()
        local x = RNGProxy > RNGProxy;
        return RNGProxy + OBFUSCATE_INT(LS_GETSTORAGE("RNGAddKey")), (RNGProxy * OBFUSCATE_INT(LS_GETSTORAGE("RNGMulKey"))), x;
      end)()
      RequestIndexCount = RequestIndexCount + 1;
      RequestBody[LS_ENCSTR("Url")] = LS_ENCSTR("http://127.0.0.1:8081/auth/") .. PROJECT_ID .. SlashCharacter .. LicenseKey .. SlashCharacter .. (RNG + OBFUSCATE_INT(_RNG_ADDITION_KEY)) .. SlashCharacter .. (RNGProxy - OBFUSCATE_INT(LS_GETSTORAGE("RNGSUBKey"))) .. SlashCharacter .. ((RNGProxy / 0) + 0) .. SlashCharacter .. (RNGProxy .. "");
    end)
  end;
end;

ResponseBody = RequestFunction(RequestBody);
ResponseHeaders = ResponseBody[LS_ENCSTR("headers")] or ResponseBody[LS_ENCSTR("Headers")];
ResponseBody = ResponseBody[LS_ENCSTR("body")] or ResponseBody[LS_ENCSTR("Body")];

LS_CF(function() 
  local ok = pcall(function() 
    do
      return ResponseBody:sub(0, 1) + 0;
    end;
  end)
  if not ok then
    if Notify then
      Notify(LS_ENCSTR("Failed!"), LS_ENCSTR("Failed to verify response signature"))
    end;
    return print(LS_ENCSTR("[*] Failed to verify response signature (contact developer)"));
  end;
end)

LS_CF(function() 
  LS_PROXY_CHECK(1)

  if RequestIndexCount > 1 then
    while true do end;
  end;

  if RequestIndexCount < 1 then
    while true do end;
  end;
end)

local function iscclosure(f) 
  return info(f, "s") == "[C]";
end;

local CustomFind;
do
  CustomFind = function(s, b) 
    LS_CF(function() 
      for i=1,#s do
        if sub(s, i) == b then
          return true;
        end;
      end;
    end)
  end;
end;

do
  local proxy = newproxy(true);
  local mt = getmetatable(proxy);
  mt.__index = function(self, idx) 
    LS_CF(function() 
      if self ~= proxy then
        while true do end;
      end;
      if idx == LS_ENCSTR(_PROXYKEYONE) then
        return OBFUSCATE_INT(_PROXYKEYTWO);
      end;
    end)
  end;
  
  if proxy[LS_ENCSTR(_PROXYKEYONE)] ~= OBFUSCATE_INT(_PROXYKEYTWO) then
    while true do end;
  end;
end;

if not iscclosure(freeze) then
  while true do end;
end;

if not iscclosure(setmetatable) then
  while true do end;
end;

local ErrorMsg = LS_ENCSTR(":")
local SCharacter = LS_ENCSTR("s");

LS_RANDOMISE(function() 
  LS_CF(function() 
    if time() < clock() then
      while true do end;
    end;
  end)

  xpcall(clock, function(e)
    LS_CF(function() 
      if find(e, ErrorMsg) then
        while true do end;
      end;
      if CustomFind(e, ErrorMsg) then
        while true do end;
      end;
    end)
  end);
  
  xpcall(time, function(e)
    LS_CF(function() 
      if find(e, ErrorMsg) then
        while true do end;
      end;
      if CustomFind(e, ErrorMsg) then
        while true do end;
      end;
    end)
  end);
end)

local ErrorCount = 0;

LS_RANDOMISE(function() 
  xpcall(tostring, function(e)
    LS_CF(function() 
      if find(e, ErrorMsg) then
        while true do end;
      end;
      if CustomFind(e, ErrorMsg) then
        while true do end;
      end;
      ErrorCount = ErrorCount + 1; -- 1
    end)
  end);

  xpcall(info, function(e)
    LS_CF(function() 
      if find(e, ErrorMsg) then
        while true do end;
      end;
      if CustomFind(e, ErrorMsg) then
        while true do end;
      end;
      ErrorCount = ErrorCount + 1; -- 2
    end)
  end);
  
  xpcall(setmetatable, function(e)
    LS_CF(function() 
      if find(e, ErrorMsg) then
        while true do end;
      end;
      if CustomFind(e, ErrorMsg) then
        while true do end;
      end;
      ErrorCount = ErrorCount + 1; -- 3
    end)
  end);
  
  xpcall(sub, function(e)
    LS_CF(function() 
      if find(e, ErrorMsg) then
        while true do end;
      end;
      if CustomFind(e, ErrorMsg) then
        while true do end;
      end;
      ErrorCount = ErrorCount + 1; -- 4
    end)
  end);
  
  xpcall(find, function(e)
    LS_CF(function() 
      if find(e, ErrorMsg) then
        while true do end;
      end;
      if CustomFind(e, ErrorMsg) then
        while true do end;
      end;
      ErrorCount = ErrorCount + 1; -- 5
    end)
  end);
  
  xpcall(xpcall, function(e)
    LS_CF(function() 
      if find(e, ErrorMsg) then
        while true do end;
      end;
      if CustomFind(e, ErrorMsg) then
        while true do end;
      end;
      ErrorCount = ErrorCount + 1; -- 6
    end)
  end);
  
  xpcall(pcall, function(e)
    LS_CF(function() 
      if find(e, ErrorMsg) then
        while true do end;
      end;
      if CustomFind(e, ErrorMsg) then
        while true do end;
      end;
      ErrorCount = ErrorCount + 1; -- 7
    end)
  end);

  xpcall(math_random, function(e)
    LS_CF(function() 
      if find(e, ErrorMsg) then
        while true do end;
      end;
      if CustomFind(e, ErrorMsg) then
        while true do end;
      end;
      ErrorCount = ErrorCount + 1; -- 8
    end)
  end, {});
end)

LS_CF(function() 
  if ErrorCount < 8 then
    while true do end;
  end;

  if ErrorCount > 8 then
    while true do end;
  end;
end)

-- Luraph Anti-Tamper / Average Anti-Beautify
do
  LS_CF(function() 
    local TemporaryProxy = newproxy(true);
    local TemporaryProxyMT = getmetatable(TemporaryProxy);
    local LineString = LS_ENCSTR("l");
    local CallLine, LengthLine;
  
    TemporaryProxyMT[LS_ENCSTR("__call")] = function() 
      CallLine = info(OBFUSCATE_INT(2), LineString);
    end;
  
    TemporaryProxyMT[LS_ENCSTR("__len")] = function() 
      LengthLine = info(OBFUSCATE_INT(2), LineString);
      return OBFUSCATE_INT(1);
    end;
  
    CallLine = #TemporaryProxy;
    TemporaryProxy();
  
    if CallLine ~= LengthLine then
      while true do end;
    end;
  end)
end;

LS_CF(function() 
  local Yes = date(LS_ENCSTR("%b %Y %M"));
  local d = sub(sub(ResponseHeaders[LS_ENCSTR("date")] or ResponseHeaders[LS_ENCSTR("Date")], 0, -8), 9);
  if sub(Yes, 0, -4) ~= sub(d, 0, -7) then
    while true do end;
  end;
end)

local ELEUTHERI_ISLUA;
do
  ELEUTHERI_ISLUA = function(f) 
    LS_CF(function() 
      local ok, err = pcall(f);
      if ok then
        while true do end;
      end;
      if find(err, ErrorMsg) or CustomFind(err, ErrorMsg) then
        return true;
      end;
    end)
  end;
end;

LS_CF(function()
  LS_RANDOMISE(function() 
    if ELEUTHERI_ISLUA(find) then
      while true do end;
    end;
    
    if ELEUTHERI_ISLUA(sub) then
      while true do end;
    end;
    
    if ELEUTHERI_ISLUA(xpcall) then
      while true do end;
    end;
    
    if ELEUTHERI_ISLUA(pcall) then
      while true do end;
    end;
    
    if ELEUTHERI_ISLUA(setmetatable) then
      while true do end;
    end;

    if ELEUTHERI_ISLUA(tostring) then
      while true do end;
    end;
    
    local ELEUTHERI_TABLECHECK;
    local ELEUTHERISANITY = {};
    for i=1, 1000 do
      ELEUTHERISANITY[i] = true;
    end;
  end)
end)

do
  local source = info(1, SCharacter);
  local checks = {};
  
  ProtectedTable = function() 
    local tbl = {};
    local id = #checks + 1;
    checks[id] = 0;
    return setmetatable({}, freeze({
      [LS_ENCSTR("__index")] = function(self, idx) 
        LS_CF(function() 
          local nsource = info(OBFUSCATE_INT(2), SCharacter);
          local nfunc = info(OBFUSCATE_INT(2), "f");
          if not LPH_OBFUSCATED then
            if source ~= nsource then
              while true do end;
            end;
            if info(nfunc, SCharacter) ~= source then
              while true do end;
            end;
          end;
          if idx == LS_ENCSTR(_METATABLEKEYONE) then
            checks[id] = checks[id] + 1;
          end;
          ELEUTHERISANITY[OBFUSCATE_INT(_METATABLEKEYTWO)] = false;
          do
            return tbl[idx];
          end
        end)
      end;
      [LS_ENCSTR("__newindex")] = function(self, idx, value) 
        LS_CF(function() 
          local nsource = info(OBFUSCATE_INT(2), SCharacter);
          local nfunc = info(OBFUSCATE_INT(2), "f");
          if not LPH_OBFUSCATED then
            if source ~= nsource then
              while true do end;
            end;
            if info(nfunc, SCharacter) ~= source then
              while true do end;
            end;
          end;
          tbl[idx] = value;
        end)
      end;
    }));
  end;

  ELEUTHERI_TABLECHECK = function() 
    LS_CF(function() 
      while ELEUTHERISANITY[OBFUSCATE_INT(_METATABLEKEYTWO)] do end;
      if ELEUTHERISANITY[OBFUSCATE_INT(_METATABLEKEYTWO)] then
        while true do end;
      end;
      for i,v in checks do
        if v < 1 then
          while true do end;
        end;
      end;
    end)
  end;
end;

local fake = ProtectedTable();
(function(...) end)(fake[LS_ENCSTR(_METATABLEKEYONE)]);

local mainResponseCount;
local count = 1
local proxy = newproxy(true);
local mt = getmetatable(proxy);
mt.__index = function(self, idx) 
  LS_CF(function() 
      if self ~= proxy then
        while true do end;
      end;
      if idx == LS_ENCSTR(_PROXYKEYTHREE) then
        return (function() 
          count = count + 1;
        end);
      else
        mainResponseCount = count;
      end;
  end)
end;

do
  local Sub   = string.sub;
  local Char  = string.char;
  local charTBL = ProtectedTable();
  (function(...) end)(charTBL[LS_ENCSTR(_METATABLEKEYONE)]);

  for i=0,255 do
    local char = Char(i);
    charTBL[i] = char;
    charTBL[char] = i;
  end;
    
  JSONDecode = function(bytecode) 
    local Pos = 1;
      
    local function gBits8() 
      LS_CF(function() 
        local r = Sub(bytecode, Pos, Pos);
        Pos = Pos + 1;
        do
          return r + 0;
        end;
      end)
    end;
      
    local function gInt() 
      LS_CF(function() 
        local len = gBits8();
        local r = Sub(bytecode, Pos, Pos + len - 1);
        Pos = Pos + len;
        do
          return r + 0;
        end;
      end)
    end;
      
    local function gString() 
      proxy[LS_ENCSTR(_PROXYKEYTHREE)]()
      LS_CF(function() 
        local len = gInt();
        local r = "";
        for i=1, len do
          r = r .. charTBL[gInt()];
        end;
        do
          return r;
        end;
      end)
    end;
      
    local function DecodeObject() 
      local Size = gInt();
      local Object = ProtectedTable();
      
      local function HandleValue() 
        LS_CF(function() 
          local Type = gInt();
          if Type == OBFUSCATE_INT(JSON_STRING_OP) then
            return gString();
          end;
          if Type == OBFUSCATE_INT(JSON_INT_OP) then
            return gInt();
          end;
          if Type == OBFUSCATE_INT(JSON_OBJ_OP) then
            return DecodeObject();
          end;
          if Type == OBFUSCATE_INT(JSON_BOOL_OP) then
            return gBits8() == 1;
          end;
          if Type == OBFUSCATE_INT(JSON_FLOAT_OP) then -- special number
            return gString() + 0;
          end;
        end)
      end;
      
      LS_CF(function() 
        local Timestamp = gString();
        if time() - Timestamp > OBFUSCATE_INT(50) then
          while true do end;
        end;

        if BackupTime - Timestamp > OBFUSCATE_INT(50) then
          while true do end;
        end;
        
        for i=1, Size do
          local i,v = HandleValue(), HandleValue();
          Object[i] = v;
        end;
  
        if Object[LS_ENCSTR(_RESPONSE_TOKEN_INDEX)] ~= LS_ENCSTR(_UNIQUETOKEN) then
          while true do end;
        end;
      end)
      
      return Object;
    end;
      
    return DecodeObject();
  end;
end;

local MainResponse = JSONDecode(ResponseBody);
(function(...) 
  do
    return proxy.f;
  end;
end)(MainResponse[LS_ENCSTR(_METATABLEKEYONE)]);
while MainResponse[LS_ENCSTR(_RESPONSE_INTERINDEX)] < OBFUSCATE_INT(_INTERVALKEY) do
end;

local BlacklistedData;
local UserData;
local ServerStorage;

LS_CF(function() 
  BlacklistedData = JSONDecode(MainResponse[LS_ENCSTR(_RESPONSE_BLACKLIST_OBJECT)]);
  (function(...) 
  end)(BlacklistedData[LS_ENCSTR(_METATABLEKEYONE)]);
  
  UserData = JSONDecode(MainResponse[LS_ENCSTR(_RESPONSE_USER_OBJECT)]);
  (function(...) 
  end)(UserData[LS_ENCSTR(_METATABLEKEYONE)]);

  ServerStorage = JSONDecode(MainResponse[LS_ENCSTR(_RESPONSE_STORAGE)]);
  (function(...) 
  end)(ServerStorage[LS_ENCSTR(_METATABLEKEYONE)]);
end)

LS_CF(function() 
  LS_PROXY(2)
end)

LS_CF(function() 
  if BlacklistedData[LS_ENCSTR(_RESPONSE_BLACKLISTED_BOOL)] - 1 == OBFUSCATE_INT(0) then
    print(LS_ENCSTR("[*] You are blacklisted. Reason:"), BlacklistedData[LS_ENCSTR(_RESPONSE_BLACKLISTED_REASON)]);
    while true do end;
  end;
  
  if BlacklistedData[LS_ENCSTR(_RESPONSE_BLACKLISTED_BOOL)] > OBFUSCATE_INT(0) then
    while true do end;
  end;  

  if time() - MainResponse[LS_ENCSTR(_RESPONSE_TIMESTAMP)] > OBFUSCATE_INT(50) then
    while true do end;
  end;

  if MainResponse[LS_ENCSTR(_RESPONSE_USERKEY)] ~= LicenseKey then
    while true do end;
  end;
end)


LS_CF(function() 
  local ResponseRNG = MainResponse[LS_ENCSTR(_RESPONSE_RNG)] - OBFUSCATE_INT(_RNG_ADDITION_KEY);
  local SecondRNG = MainResponse[LS_ENCSTR(_RESPONSE_SECONDARY_RNG)] + 0;
  local ThirdRNG = MainResponse[LS_ENCSTR(_RESPONSE_THIRD_RNG)] + 0;
  local FourthRNG = MainResponse[LS_ENCSTR(_RESPONSE_FOUTH_RNG)] + 0;

  if ResponseRNG ~= RNG then
    while true do end;
  end;

  if SecondRNG ~= (RNGProxy - OBFUSCATE_INT(LS_GETSTORAGE("RNGSUBKey"))) then
    while true do end;
  end;

  if ThirdRNG ~= (RNGProxy / 0) + 0 then
    while true do end;
  end;

  for i,v in RNGProxy do
    if i == OBFUSCATE_INT(LS_GETSTORAGE("RNGIterKey")) then
      break;
    end;
  end;

  (function() 
    return RNGProxy + OBFUSCATE_INT(LS_GETSTORAGE("RNGAddKey")), RNGProxy * OBFUSCATE_INT(LS_GETSTORAGE("RNGMulKey")), RNGProxy > RNGProxy;
  end)()

  if SecondRNG == RNGProxy - OBFUSCATE_INT(LS_GETSTORAGE("RNGSUBKey")) then
    while true do end;
  end;

  if ThirdRNG == (RNGProxy / 0) + 0 then
    while true do end;
  end;

  if FourthRNG == (RNGProxy .. "") then
    while true do end;
  end;
end)

local INTEGRITY_VM;
local SECURE_REQUEST;
local VM_BYTECODE;
local CHECK_PROXY;

local DecryptedOpIndex = LS_ENCSTR(_OPCODE_INDEX)
local DecryptedAIndex = LS_ENCSTR(_A_REGISTER)
local DecryptedBIndex = LS_ENCSTR(_B_REGISTER)
local INTERGRITY_BASE = START_INTEGRITY_BASE;

LS_CF(function() 
  LS_PROXY(3)
end)

INTEGRITY_VM = function() 
  LS_CF(function() 
    local Instructions = JSONDecode(VM_BYTECODE);
    local Stack = {};
    local PC = 1;
    (function() end)();
  end)

  repeat

  until RequestIndexed;

  LS_CF(function() 
    for i,v in RequestProxy do
      if i == OBFUSCATE_INT(_REQUEST_PROXY_INTER_KEY) then
        break
      end;
    end;

    if #RequestProxy ~= OBFUSCATE_INT(_REQUEST_PROXY_LEN_KEY) then
      while true do end;
    end;

    LS_PROXY_CHECK(1)
    LS_PROXY_CHECK(2)
    LS_PROXY_CHECK(3)
  end)

  while true do 
    LS_CF(function() 
      local Instr = Instructions[PC .. ""];
      local opcode = Instr[DecryptedOpIndex];

      if opcode == OBFUSCATE_INT(8) then -- RETURN
        for i,v in RequestProxy do
          if i == OBFUSCATE_INT(_REQUEST_PROXY_INTER_KEY) then
            break
          end;
        end;

        if #RequestProxy ~= OBFUSCATE_INT(_REQUEST_PROXY_LEN_KEY) then
          while true do end;
        end;

        LS_PROXY_CHECK(1)
        LS_PROXY_CHECK(2)
        LS_PROXY_CHECK(3)

        local x = INTERGRITY_BASE;
        INTERGRITY_BASE = INTERGRITY_BASE + OBFUSCATE_INT(_VM_INTEGRITY_KEY);
        return x;
      end;

      if opcode == OBFUSCATE_INT(2) then -- LOADK
        Stack[Instr[DecryptedAIndex]] = Instr[DecryptedBIndex];
      end;

      if opcode == OBFUSCATE_INT(3) then -- LOADGLOBAL
        Stack[Instr[DecryptedAIndex]] = _env[Stack[Instr[DecryptedBIndex]]];
      end;

      if opcode == OBFUSCATE_INT(4) then -- CALL
        local Args = {};
        for i=#Stack, (#Stack - Instr[DecryptedBIndex]) + 1, -1 do
            Args[#Args + 1] = Stack[i];
        end;
        Stack[Instr[DecryptedAIndex]](unpack(Args));
      end;

      if opcode == OBFUSCATE_INT(1) then -- MOV
        Stack[Instr[DecryptedAIndex]] = Stack[Instr[DecryptedBIndex]];
      end;

      if opcode == OBFUSCATE_INT(9) then -- EQ
        Stack[#Stack+1] = Stack[Instr[DecryptedAIndex]] == Stack[Instr[DecryptedBIndex]];
      end;

      if opcode == OBFUSCATE_INT(10) then -- JEQ
        if Stack[#Stack] then
          PC = PC + Instr[DecryptedAIndex];
        end;
      end;

      if opcode == OBFUSCATE_INT(12) then -- Get License Key
        Stack[Instr[DecryptedAIndex]] = AUTH_USER_LICENSE;
      end;

      if opcode == OBFUSCATE_INT(13) then -- JMP
        PC = PC + Instr[DecryptedAIndex]
      end;

      if opcode == OBFUSCATE_INT(14) then -- Get HWID
        Stack[Instr[DecryptedAIndex]] = AUTH_USER_HWID;
      end;

      if opcode == OBFUSCATE_INT(15) then -- Get Response Index
        Stack[Instr[DecryptedAIndex]] = MainResponse[Instr[DecryptedBIndex]]
      end;

      PC = PC + OBFUSCATE_INT(1);
    end)
  end
end;

SECURE_REQUEST = function(Url, Method, Headers, Body) 
  LS_CF(function() 
    for i,v in RequestProxy do
      if i == OBFUSCATE_INT(_REQUEST_PROXY_INTER_KEY) then
        break
      end;
    end;
    
    LS_PROXY_CHECK(3)

    local UserRequestURLCount = 0;
    local UserRequestMethodCount = 0;
    local UserRequestHeaderCount = 0;
    local UserRequestIndexed;
  end)

  local UserRequest = {};
  setmetatable(UserRequest, {});

  local UserRequestMT = getmetatable(UserRequest);
  UserRequestMT[LS_ENCSTR("__metatable")] = {};
  UserRequestMT[LS_ENCSTR("__tostring")] = function() while true do end; end;
  UserRequestMT[LS_ENCSTR("__iter")] = function() while true do end; end

  UserRequestMT[LS_ENCSTR("__index")] = function(self, idx) 
    if self ~= UserRequest then
      while true do end;
    end;
    local s, n = info(OBFUSCATE_INT(2), LS_ENCSTR("sn"));
    if s ~= LS_ENCSTR("[C]") then
      while true do end;
    end;
    if n ~= RequestDebugName and n ~= LS_ENCSTR("pcall") then
      while true do end;
    end;
    UserRequestIndexed = true;
    if idx == LS_ENCSTR("Url") or idx == LS_ENCSTR("url") then
      UserRequestURLCount = UserRequestURLCount + OBFUSCATE_INT(1);
      return Url;
    elseif idx == LS_ENCSTR("Method") or idx == LS_ENCSTR("method") then
      UserRequestMethodCount = UserRequestMethodCount + OBFUSCATE_INT(1);
      return Method;
    elseif idx == LS_ENCSTR("Headers") or idx == LS_ENCSTR("headers") then
      UserRequestHeaderCount = UserRequestHeaderCount + OBFUSCATE_INT(1);
      return Headers;
    elseif idx == LS_ENCSTR("Body") or idx == LS_ENCSTR("body") then
      return Body;
    end;
  end;

  local Response;
  LS_CF(function() 
    Response = RequestFunction(UserRequest);

    if UserRequestURLCount < OBFUSCATE_INT(1) or UserRequestURLCount > OBFUSCATE_INT(1) then
      while true do end;
    end;

    if UserRequestMethodCount < OBFUSCATE_INT(1) or UserRequestMethodCount > OBFUSCATE_INT(1) then
      while true do end;
    end;

    if UserRequestHeaderCount < OBFUSCATE_INT(1) or UserRequestHeaderCount > OBFUSCATE_INT(1) then
      while true do end;
    end;

    if not UserRequestIndexed then
      while true do end;
    end;
  end)
  return Response;
end;

CHECK_PROXY = function() 
  local ok, res = pcall(SECURE_REQUEST, LS_ENCSTR("http://127.0.0.1:8888/"));
  if ok then
    local body = res[LS_ENCSTR("body")] or res[LS_ENCSTR("Body")];
    if find(body, LS_ENCSTR("charlesproxy")) or find(body, LS_ENCSTR("fiddler")) then
      return true;
    end;
  end;
  return false;
end;

local PC = OBFUSCATE_INT(1);
local Bytecode = MainResponse[LS_ENCSTR(_RESPONSE_BYTECODE)];
local MiscFlag = false;

while true do 
  local Opcode = sub(Bytecode, PC, PC + 2) + 0;
  PC = PC + 3;

  if Opcode == OBFUSCATE_INT(0) then
    break;
  end;

  LS_CF(function() 
    if Opcode == OBFUSCATE_INT(1) then
      MiscFlag = true;
      AUTH_USER_LICENSE = UserData.c;
    end;

    if Opcode == OBFUSCATE_INT(2) then
      AUTH_USER_DISCORD_ID = UserData.a;
    end;

    if Opcode == OBFUSCATE_INT(3) then
      AUTH_USER_HWID = UserData.b;
    end;

    if Opcode == OBFUSCATE_INT(4) then
      AUTH_LOADER_HASH = MainResponse[LS_ENCSTR(_RESPONSE_LOADER_HASH)];
    end;

    if Opcode == OBFUSCATE_INT(5) then
      AUTH_USER_EXPIRE = UserData.d;
    end;

    if Opcode == OBFUSCATE_INT(6) then
      AUTH_STORAGE = ServerStorage;
    end;

    if Opcode == OBFUSCATE_INT(7) then
      AUTH_INTEGRITY = INTEGRITY_VM;
    end;

    if Opcode == OBFUSCATE_INT(8) then
      VM_BYTECODE = MainResponse[LS_ENCSTR(_RESPONSE_VM_BYTECODE)];
    end;

    if Opcode == OBFUSCATE_INT(9) then
      AUTH_INTEGRITY_KEY = OBFUSCATE_INT(_VM_INTEGRITY_KEY);
    end;

    if Opcode == OBFUSCATE_INT(10) then
      AUTH_SECURE_REQUEST = SECURE_REQUEST;
    end;

    if Opcode == OBFUSCATE_INT(11) then
      AUTH_CHECK_HTTP_PROXY = CHECK_PROXY;
    end;
  end)
end;

LS_CF(function() 
  if MainResponse[LS_ENCSTR(_RESPONSE_FINGERPRINT)] - 1 == OBFUSCATE_INT(0) then
    if AUTH_USER_HWID:lower() ~= HWID then
      while true do end;
    end;
  end;
end)

LS_CF(function() 
  for i,v in RequestProxy do
    if i == OBFUSCATE_INT(_REQUEST_PROXY_INTER_KEY) then
      break
    end;
  end;

  if #RequestProxy ~= OBFUSCATE_INT(_REQUEST_PROXY_LEN_KEY) then
    while true do end;
  end;

  LS_PROXY_CHECK(1)
  LS_PROXY_CHECK(2)
end)

LS_CF(function() 
  local Duration = clock() - Timestamp;
  if Duration > 60 then
    while true do end;
  end;
  if Duration <= 0 then
    while true do end;
  end;
end)

LS_CF(function() 
  if not RequestIndexed then
    while true do end;
  end;
end)

LS_CF(function() 
  if not MiscFlag then
    while true do end;
  end;

  ELEUTHERI_TABLECHECK();

  if Notify then
    Notify(LS_ENCSTR("Success!"), LS_ENCSTR("Successfully authenticated, took: ") .. (clock() - Timestamp) .. LS_ENCSTR("s"))
  end;

  print(LS_ENCSTR("[*] Successfully authenticated, took:"), (clock() - Timestamp) .. LS_ENCSTR("s"));
end)