package com.zhaobe.hyx.db;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;

public class DBManager {
	private DBHelper helper;
	private SQLiteDatabase db;

	public DBManager(Context context) {
		// helper = new DBHelper(context);
		// db = helper.getWritableDatabase();

		SQLiteDatabase.openDatabase("/test1.db", null,
				SQLiteDatabase.OPEN_READONLY
						| SQLiteDatabase.CREATE_IF_NECESSARY);
	}

	public void closeDB() {
		db.close();
	}
}
