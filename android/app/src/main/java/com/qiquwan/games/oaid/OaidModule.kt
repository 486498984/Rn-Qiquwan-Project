package com.qiquwan.games.oaid

import android.app.Application
import com.facebook.react.bridge.*
import com.github.gzuliyujiang.oaid.DeviceID
import com.github.gzuliyujiang.oaid.IGetter

class OaidModule(
    private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "OaidModule"

    /**
     * 用户同意隐私后调用
     */
    @ReactMethod
    fun init() {
        val app = reactContext.applicationContext as Application
        DeviceID.register(app)
    }

    /**
     * 是否支持 OAID
     */
    @ReactMethod
    fun supportedOAID(promise: Promise) {
        promise.resolve(DeviceID.supportedOAID(reactContext))
    }

    /**
     * 获取 OAID（异步）
     */
    @ReactMethod
    fun getOAID(promise: Promise) {
        DeviceID.getOAID(reactContext, object : IGetter {

            override fun onOAIDGetComplete(result: String) {
                promise.resolve(result)
            }

            override fun onOAIDGetError(error: Exception) {
                promise.reject("OAID_ERROR", error)
            }
        })
    }

    /**
     * 获取缓存 OAID（register 后可直接获取）
     */
    @ReactMethod
    fun getCachedOAID(promise: Promise) {
        promise.resolve(DeviceID.getOAID())
    }

    @ReactMethod
    fun getAndroidID(promise: Promise) {
        promise.resolve(DeviceID.getAndroidID(reactContext))
    }

    @ReactMethod
    fun getGUID(promise: Promise) {
        promise.resolve(DeviceID.getGUID(reactContext))
    }

    @ReactMethod
    fun getUniqueID(promise: Promise) {
        promise.resolve(DeviceID.getUniqueID(reactContext))
    }

    @ReactMethod
    fun getPseudoID(promise: Promise) {
        promise.resolve(DeviceID.getPseudoID())
    }

    @ReactMethod
    fun getCanvasFingerprint(promise: Promise) {
        promise.resolve(DeviceID.getCanvasFingerprint())
    }

    /**
     * 一次返回全部
     */
    @ReactMethod
    fun getDeviceInfo(promise: Promise) {

        val map = Arguments.createMap()

        map.putBoolean("supportedOAID", DeviceID.supportedOAID(reactContext))
        map.putString("oaid", DeviceID.getOAID())
        map.putString("androidId", DeviceID.getAndroidID(reactContext))
        map.putString("guid", DeviceID.getGUID(reactContext))
        map.putString("uniqueId", DeviceID.getUniqueID(reactContext))
        map.putString("pseudoId", DeviceID.getPseudoID())
        map.putString("canvasFingerprint", DeviceID.getCanvasFingerprint())

        promise.resolve(map)
    }
}