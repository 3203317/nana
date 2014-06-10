package com.zhaobe.hyx.activity;

import android.app.Activity;
import android.os.Bundle;
import android.view.Window;

import com.zhaobe.hyx.R;

public class LoginActivity extends Activity {

	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		requestWindowFeature(Window.FEATURE_NO_TITLE);
		setContentView(R.layout.login);
	}
}
