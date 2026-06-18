package com.qiquwan.games.baidu

import com.facebook.react.bridge.*
import com.baidu.mobads.action.BaiduAction
import com.baidu.mobads.action.ActionType
import com.baidu.mobads.action.PrivacyStatus
import org.json.JSONObject

class BaiduModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var isInit = false

    override fun getName(): String {
        return "BaiduSDK"
    }

    // ================= INIT =================
    @ReactMethod
    fun init(appId: Long, secret: String) {
        if (isInit) return

        System.loadLibrary("msaoaidsec")

        BaiduAction.setPrintLog(true)

        BaiduAction.init(
            reactContext,
            appId,
            secret
        )

        BaiduAction.setActivateInterval(reactContext, 7)

        isInit = true
    }

    // ================= PRIVACY =================
    @ReactMethod
    fun setPrivacyAgree() {
        BaiduAction.setPrivacyStatus(PrivacyStatus.AGREE)
    }

    @ReactMethod
    fun setPrivacyDisagree() {
        BaiduAction.setPrivacyStatus(PrivacyStatus.DISAGREE)
    }

    // ================= REGISTER =================
    @ReactMethod
    fun register() {
        BaiduAction.logAction(ActionType.REGISTER)
    }

    // ================= PURCHASE =================
    @ReactMethod
    fun purchase(amount: Double) {
        try {
            val json = JSONObject()

            // 元 → 分
            val fen = (amount * 100).toInt()
            json.put("purchase_money", fen)

            BaiduAction.logAction(ActionType.PURCHASE, json)

        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}