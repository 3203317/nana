-- huangxin <3203317@qq.com>

local var = ngx.var;


local _timestamp = var.arg_timestamp;









local util = require "util";

_timestamp = util.isEmpty(_timestamp);

if nil == _timestamp then
  return ngx.say('{"error":{"code":40001}}');
end;


ngx.say('{"data":{"msg":"hello lua!"}}');
