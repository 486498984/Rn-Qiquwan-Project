package com.qiquwan.games.wxapi;

// react-native-wechat-lib support (
import android.app.Activity;
import android.os.Bundle;
import android.content.Intent;
import com.theweflex.react.WeChatModule;

public class WXEntryActivity extends Activity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    WeChatModule.handleIntent(getIntent());
  }

  @Override
  protected void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    setIntent(intent);
    WeChatModule.handleIntent(intent);
  }

  @Override
  protected void onResume() {
    super.onResume();
    finish();
    overridePendingTransition(0, 0);
  }
}
// )