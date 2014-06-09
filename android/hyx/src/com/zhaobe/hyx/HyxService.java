package com.zhaobe.hyx;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;

public class HyxService extends Service {

	private final static String TAG = "HyxService";

	@Override
	public IBinder onBind(Intent arg0) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void onCreate() {
		super.onCreate();
		Log.v(TAG, "onCreate");
	}

	@Override
	public int onStartCommand(Intent intent, int flags, int startId) {
		int cmd = super.onStartCommand(intent, flags, startId);
		Log.v(TAG, "onStartCommand");
		return cmd;
	}

	@Override
	public void onDestroy() {
		super.onDestroy();
		Log.v(TAG, "onDestroy");
	}

}
