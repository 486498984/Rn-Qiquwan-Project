package com.qiquwan.games.alionepass;

import android.app.Activity;
import android.content.Context;
import android.content.pm.ActivityInfo;
import android.graphics.Color;
import android.os.Build;

import androidx.annotation.NonNull;
import android.widget.ImageView;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.mobile.auth.gatewayauth.PhoneNumberAuthHelper;
import com.mobile.auth.gatewayauth.TokenResultListener;
import com.mobile.auth.gatewayauth.PreLoginResultListener;
import com.mobile.auth.gatewayauth.AuthUIConfig;
import org.json.JSONObject;
import org.json.JSONException;
public class AliOnePassModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private PhoneNumberAuthHelper mPhoneNumberAuthHelper;
    private int timeout = 15000; // 15秒，更稳妥
    public AliOnePassModule(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        //initOnePass();
    }

    @NonNull
    @Override
    public String getName() {
        return "AliOnePassModule";
    }

    private void initOnePass() {
        String secretInfo = "";

        // 初始化 SDK
        mPhoneNumberAuthHelper = PhoneNumberAuthHelper.getInstance(reactContext, null);
        mPhoneNumberAuthHelper.getReporter().setLoggerEnable(true);
        mPhoneNumberAuthHelper.setAuthSDKInfo(secretInfo);

        // 检测环境
        mPhoneNumberAuthHelper.checkEnvAvailable(PhoneNumberAuthHelper.SERVICE_TYPE_LOGIN);

        // 加速授权页（非阻塞）
        mPhoneNumberAuthHelper.accelerateLoginPage(timeout, new PreLoginResultListener() {
            @Override
            public void onTokenSuccess(String s) { }
            @Override
            public void onTokenFailed(String s, String s1) { }
        });

        // 注意：这里不要拉起 token
    }

    /** 
     * JS 调用 getLoginToken 之前必须先调用此方法设置 UI
     */
    @ReactMethod
    public void setAuthUI(Promise promise) {
        Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            promise.reject("NO_ACTIVITY", "当前 Activity 为空");
            return;
        }

        int authPageOrientation = ActivityInfo.SCREEN_ORIENTATION_SENSOR_PORTRAIT;
        if (Build.VERSION.SDK_INT == 26) authPageOrientation = ActivityInfo.SCREEN_ORIENTATION_BEHIND;

        // UI 配置示例
        AuthUIConfig uiConfig = new AuthUIConfig.Builder()
        // 显示返回按钮
                .setNavReturnHidden(false)  // false 表示显示返回按钮
                .setLogBtnBackgroundPath("login_btn_bg")
                .setAppPrivacyOne("《用户协议》", "https://tourok.com.cn/policy/user.html")
                .setAppPrivacyTwo("《隐私协议》", "https://tourok.com.cn/policy/privacy.html")
                .setAppPrivacyColor(Color.GRAY, Color.parseColor("#002E00"))
                .setSwitchAccHidden(true)
                .setStatusBarColor(Color.parseColor("#FFFFFF"))
                .setBottomNavColor(Color.parseColor("#FFFFFF"))
                .setLightColor(true)
                .setNavReturnImgWidth(22)
                .setNavReturnImgHeight(22)
                .setLogBtnWidth(303)
                .setLogBtnHeight(48)
                .setNavReturnScaleType(ImageView.ScaleType.FIT_CENTER)
                .setNavColor(Color.parseColor("#FFFFFF")) // 导航栏橙色
                .setNavHidden(false)
                .setNavReturnImgPath("my_black_back_icon")
                .setVendorPrivacyPrefix("《")
                .setVendorPrivacySuffix("》")
                .setLogoImgPath("applogo")
                .setLogBtnText("本机号码一键登录")
                .setLogoOffsetY(50)    // Logo 离授权页顶部的偏移，单位 dp
                .setLogoWidth(82)      // Logo 宽度，单位 dp
                .setLogoHeight(82)     // Logo 高度，单位 dp
                .setScreenOrientation(authPageOrientation)
                .create();

        mPhoneNumberAuthHelper.setAuthUIConfig(uiConfig);

        promise.resolve("Auth UI 设置成功");
    }

@ReactMethod
public void setAuthSDKInfo(String secretInfo, Promise promise) {
    if (mPhoneNumberAuthHelper == null) {
        mPhoneNumberAuthHelper = PhoneNumberAuthHelper.getInstance(reactContext, null);
        mPhoneNumberAuthHelper.getReporter().setLoggerEnable(true);
    }

    try {
        mPhoneNumberAuthHelper.setAuthSDKInfo(secretInfo);

        // 检查环境
        mPhoneNumberAuthHelper.checkEnvAvailable(PhoneNumberAuthHelper.SERVICE_TYPE_LOGIN);

        // 加速授权页（非阻塞）
        mPhoneNumberAuthHelper.accelerateLoginPage(timeout, new PreLoginResultListener() {
            @Override
            public void onTokenSuccess(String s) { }
            @Override
            public void onTokenFailed(String s, String s1) { }
        });

        promise.resolve("SDK初始化成功");
    } catch (Exception e) {
        promise.reject("INIT_FAILED", e.getMessage());
    }
}


    @ReactMethod
    public void getLoginToken(final Promise promise) {
        final Activity currentActivity = getCurrentActivity();
        if (currentActivity == null) {
            promise.reject("NO_ACTIVITY", "当前 Activity 为空");
            return;
        }

    // 设置 Token 回调
    TokenResultListener listener = new TokenResultListener() {
        @Override
public void onTokenSuccess(String resultJson) {
    try {
        JSONObject json = new JSONObject(resultJson);
        String code = json.optString("code");
        if ("600000".equals(code)) {
            // 真正获取 token 成功
            if (mPhoneNumberAuthHelper != null) {
                mPhoneNumberAuthHelper.quitLoginPage(); // 关闭授权页
            }
            promise.resolve(resultJson);
        } else {
            // 其他状态，例如唤起授权页成功，不做关闭
            //Log.d("AliOnePass", "状态回调，不关闭页面: " + resultJson);
        }
    } catch (JSONException e) {
        e.printStackTrace();
        promise.reject("PARSE_ERROR", e.getMessage());
    }
}

    @Override
    public void onTokenFailed(String errorJson) {
        if (mPhoneNumberAuthHelper != null) {
            mPhoneNumberAuthHelper.quitLoginPage();
        }

    promise.reject("TOKEN_FAILED", errorJson);
    }
    };

        mPhoneNumberAuthHelper.setAuthListener(listener);
        mPhoneNumberAuthHelper.getLoginToken(currentActivity, timeout);
    }
}