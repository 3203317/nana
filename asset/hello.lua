-- huangxin <3203317@qq.com>

local var = ngx.var;


local _timestamp = var.arg_timestamp;



local util = require "util";

_timestamp = util.isEmpty(_timestamp);

if nil == _timestamp then
  ngx.say('{"error":{"code":40001}}');
  return ngx.exit(ngx.HTTP_OK);
end;


--[[
UTC
--]]
local _utctime = (ngx.now() - 8 * 60 * 60) * 1000;




ngx.say('{"data":{"msg":"hello lua!"}}');
ngx.exit(ngx.HTTP_OK);
