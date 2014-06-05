package com.zhaobe.hyx.db;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

public class DBHelper extends SQLiteOpenHelper {

	public DBHelper(Context context) {
		super(context, DB_NAME, null, DB_VER);
	}

	private static final String DB_NAME = "test.db";
	private static final int DB_VER = 3;

	@Override
	public void onCreate(SQLiteDatabase db) {
		db.execSQL("CREATE TABLE IF NOT EXISTS user"
				+ "(id VARCHAR PRIMARY KEY AUTOINCREMENT, userName VARCHAR, userPass VARCHAR)");
	}

	@Override
	public void onUpgrade(SQLiteDatabase db, int oldVer, int newVer) {
		db.execSQL("ALTER TABLE user ADD COLUMN other STRING");
	}

}
