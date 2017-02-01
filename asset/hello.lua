-- huangxin <3203317@qq.com>

local var = ngx.var;
local util = require 'util';


local _timestamp = var.arg_timestamp;
_timestamp = util:isEmpty(_timestamp);

if nil == _timestamp then
  ngx.say('{"error":{"code":40001}}');
  return ngx.exit(ngx.HTTP_OK);
end;

local _method = var.arg_method;
_method = util:isEmpty(_method);

if nil == _method then
  ngx.say('{"error":{"code":40002}}');
  return ngx.exit(ngx.HTTP_OK);
end;

--[[
tonumber
--]]
_timestamp = tonumber(_timestamp);

if nil == _timestamp then
  ngx.say('{"error":{"code":40001}}');
  return ngx.exit(ngx.HTTP_OK);
end;

--[[
UTC
--]]
local _utctime = (ngx.now() - 8 * 60 * 60) * 1000;

if (_timestamp < (_utctime - 3600000)) or ((_utctime + 3600000) < _timestamp) then
  ngx.say('{"error":{"code":40001,"system_time":'.. _utctime  ..'}}');
  return ngx.exit(ngx.HTTP_OK);
end;


ngx.say('{"data":{"msg":"hello lua!"}}');
ngx.exit(ngx.HTTP_OK);
