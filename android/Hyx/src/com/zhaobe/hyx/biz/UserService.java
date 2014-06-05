package com.zhaobe.hyx.biz;

public interface UserService {
	/**
	 * 用户客户端登陆
	 * 
	 * @param userName
	 * @param userPass
	 * @return
	 */
	boolean login(String userName, String userPass);
}
