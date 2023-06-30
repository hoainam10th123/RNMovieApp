package com.movieai;

import android.content.Context;
import android.content.Intent;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class PipModule extends ReactContextBaseJavaModule{
    Context context;
    PipModule(ReactApplicationContext context) {
        super(context);
        this.context = context.getApplicationContext();
    }

    @Override
    public String getName() {
        return "PipModule";
    }

    @ReactMethod
    public void playVideoEvent(String key) {
        Intent intent = new Intent(this.context, MovieActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.putExtra("key", key);
        this.context.startActivity(intent);
    }
}
