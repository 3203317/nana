package com.zhaobe.hyx;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

public class UserServiceTest {

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
		System.out.println();
	}

	@Before
	public void init() {
		System.out.println();
	}

	@After
	public void destroy() {
		System.out.println();
	}

	@AfterClass
	public static void tearDownAfterClass() throws Exception {
		System.out.println();
	}

	@Test
	public void login() {
		System.out.println(121);
	}
}
