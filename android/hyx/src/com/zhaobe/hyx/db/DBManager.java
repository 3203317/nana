package com.zhaobe.hyx.db;

import java.util.ArrayList;
import java.util.List;

import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;

import com.zhaobe.hyx.model.User;

public class DBManager {
	private DBHelper helper;
	private SQLiteDatabase db;

	public DBManager(Context context) {
		helper = new DBHelper(context);
		db = helper.getWritableDatabase();
	}

	public List<User> query() {
		ArrayList<User> users = new ArrayList<User>();
		Cursor cursor = db.rawQuery("SELECT * FROM s_user", null);
		while (cursor.moveToNext()) {
			User user = new User();
			user.setId(cursor.getString(cursor.getColumnIndex("id")));
			user.setUserName(cursor.getString(cursor.getColumnIndex("username")));
			user.setUserPass(cursor.getString(cursor.getColumnIndex("userpass")));
			user.setSex(cursor.getInt(cursor.getColumnIndex("sex")));
			users.add(user);
		}
		cursor.close();
		return users;
	}

	public void close() {
		db.close();
	}
}
