package com.qiquwan.games.bdconvert

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.bytedance.ads.convert.BDConvert
import com.bytedance.ads.convert.event.ConvertReportHelper
import org.json.JSONObject

class BDConvertModule(
    private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "BDConvertNative"
    }

    /**
     * 方式 B：
     * 用户同意隐私政策后，调用这个方法发送启动事件。
     *
     * 注意：
     * 只能调用一次，重复调用会触发 reason=3。
     */
    @ReactMethod
    fun sendLaunchEvent(promise: Promise) {
        try {
            BDConvert.sendLaunchEvent(reactContext.applicationContext)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("BD_CONVERT_SEND_LAUNCH_ERROR", e)
        }
    }

    /**
     * 上报 active
     */
    @ReactMethod
    fun reportActive(promise: Promise) {
        try {
            val params = JSONObject()
            ConvertReportHelper.onEventV3("active", params)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("BD_CONVERT_ACTIVE_ERROR", e)
        }
    }

    /**
     * 上报 active_register
     */
    @ReactMethod
    fun reportRegister(
        method: String,
        success: Boolean,
        promise: Promise
    ) {
        try {
            val params = JSONObject()
            params.put("method", method)
            params.put("is_success", success)

            //ConvertReportHelper.onEventV3("active_register", params)
            ConvertReportHelper.onEventRegister(method,true);
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("BD_CONVERT_REGISTER_ERROR", e)
        }
    }

    /**
     * 上报 active_pay
     */
    @ReactMethod
    fun reportPay(
        amount: Double,
        currency: String,
        paymentChannel: String,
        contentId: String,
        contentName: String,
        success: Boolean,
        promise: Promise
    ) {
        try {
            val params = JSONObject()
            params.put("amount", amount)
            params.put("currency", currency)
            params.put("payment_channel", paymentChannel)
            params.put("content_id", contentId)
            params.put("content_name", contentName)
            params.put("is_success", success)

            //ConvertReportHelper.onEventV3("active_pay", params)
            ConvertReportHelper.onEventPurchase("gift","flower", "008", 1, paymentChannel,"¥", true, amount.toInt());
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("BD_CONVERT_PAY_ERROR", e)
        }
    }
}