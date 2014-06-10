package test.com.zhaobe.hyx;

import android.content.Context;
import android.content.Intent;
import android.test.ServiceTestCase;
import android.util.Log;

import com.zhaobe.hyx.HyxService;

public class HyxServiceTest extends ServiceTestCase<HyxService> {

	private final static String TAG = "hyxServiceTest";
	private Context context;

	public HyxServiceTest(Class<HyxService> serviceClass) {
		super(serviceClass);
		// TODO Auto-generated constructor stub
	}

	protected void setUp() throws Exception {
		super.setUp();
		context = getContext();
	}

	protected void tearDown() throws Exception {
		context = null;
		super.tearDown();
	}

	public void testStart() {
		Log.i(TAG, "start");
		try {
			Intent intent = new Intent();
			startService(intent);
			HyxService serv = getService();
			assertNotNull(serv);
		} catch (Exception ex) {
			Log.e(TAG, ex.getMessage());
			fail(ex.getMessage());
		} finally {
			Log.i(TAG, "end");
		}
	}

	public void testStop() {
		Log.i(TAG, "stop");
		try {
			Intent intent = new Intent();
			startService(intent);
			HyxService serv = getService();
			serv.stopService(intent);
		} catch (Exception ex) {
			fail(ex.getMessage());
		} finally {
			Log.i(TAG, "end");
		}
	}
}
