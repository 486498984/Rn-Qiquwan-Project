package com.qiquwan.games

import android.content.pm.PackageManager
import android.util.Log

import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost

import com.github.reactnativehero.umenganalytics.RNTUmengAnalyticsModule

import com.theweflex.react.WeChatPackage
import com.tencent.qcloud.rntimpush.TencentCloudPushApplication

import com.qiquwan.games.oaid.OaidPackage
import com.qiquwan.games.baidu.BaiduPackage
import com.qiquwan.games.bdconvert.BDConvertPackage

import com.bytedance.ads.convert.BDConvert
import com.bytedance.ads.convert.config.BDConvertConfig
import com.bytedance.ads.convert.callback.BDConvertLifecycleCallback
import com.bytedance.ads.convert.event.ConvertReportHelper

import org.json.JSONObject

class MainApplication : TencentCloudPushApplication(), ReactApplication {

  companion object {
    private const val TAG = "BDConvertCheck"
  }

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          add(WeChatPackage()) // 微信 SDK
          add(com.qiquwan.games.alionepass.AliOnePassPackage())
          add(OaidPackage()) // 获取 OAID
          add(BaiduPackage()) // 百度埋点 SDK
          add(BDConvertPackage()) // 巨量归因 SDK
        },
    )
  }

  override fun onCreate() {
    super.onCreate()

    val appInfo = packageManager.getApplicationInfo(
      packageName,
      PackageManager.GET_META_DATA
    )
    val metaData = appInfo.metaData
    RNTUmengAnalyticsModule.init(this, metaData, false)

    /**
     * 巨量引擎融合归因 SDK：方式 B 初始化
     *
     * 这里只初始化 SDK，不发送启动事件。
     * 用户同意隐私政策后，再由 RN 调用：
     *
     * BDConvertNative.sendLaunchEvent()
     *
     * 注意：
     * sendLaunchEvent 只能调用一次。
     * 重复调用会触发 reason=3。
     */
    initBDConvertForCheck()

    loadReactNative(this)
  }

  private fun initBDConvertForCheck() {
    try {
      val config = BDConvertConfig().apply {
        /**
         * 方式 B 必须设置为 false
         * 这样 Application 初始化时不会自动采集启动事件。
         */
        autoSendLaunchEvent = false

        /**
         * 自检需要打开日志。
         * Logcat 可以搜索：
         * BDConvertCheck
         * convert
         */
        enableLog = true

        /**
         * 心跳事件开关。
         */
        playSessionEnable = true

        /**
         * 是否开启 OAID 采集。
         */
        enableOAID = true

        /**
         * 初始化和事件发送回调。
         *
         * 用途：
         * 1. Logcat 查看初始化和事件发送是否成功
         * 2. 通过 ConvertReportHelper.onEventV3 上报回调埋点
         * 3. 线上验证接入是否正常
         */
        lifecycleCallback = object : BDConvertLifecycleCallback {

          /**
           * SDK 初始化成功
           */
          override fun onInitSuccess() {
            Log.d(TAG, "onInitSuccess")

            try {
              val params = JSONObject()
              params.put("callback", "onInitSuccess")

              ConvertReportHelper.onEventV3(
                "bd_convert_init_success",
                params
              )
            } catch (e: Exception) {
              Log.e(TAG, "report bd_convert_init_success error", e)
            }
          }

          /**
           * SDK 初始化失败
           *
           * reason 对照：
           * -1 未知错误，需要根据 throwable 判断
           * 1  重复初始化，仅允许一次初始化
           * 2  在非主线程使用了初始化方式 B
           * 4  构造参数发生错误，需要根据 throwable 判断
           * 5  网络请求发生错误，需要根据 throwable 判断
           * 6  获取 android_id 时发生错误，需要根据 throwable 判断
           */
          override fun onInitFailure(reason: Int, throwable: Throwable?) {
            Log.e(TAG, "onInitFailure reason=$reason", throwable)

            try {
              val params = JSONObject()
              params.put("callback", "onInitFailure")
              params.put("reason", reason)
              params.put("reason_msg", getBDConvertReasonText(reason))
              params.put("error_msg", throwable?.message ?: "")

              ConvertReportHelper.onEventV3(
                "bd_convert_init_failure",
                params
              )
            } catch (e: Exception) {
              Log.e(TAG, "report bd_convert_init_failure error", e)
            }
          }

          /**
           * 非打断类错误
           */
          override fun onOtherError(reason: Int, throwable: Throwable?) {
            Log.e(TAG, "onOtherError reason=$reason", throwable)

            try {
              val params = JSONObject()
              params.put("callback", "onOtherError")
              params.put("reason", reason)
              params.put("reason_msg", getBDConvertReasonText(reason))
              params.put("error_msg", throwable?.message ?: "")

              ConvertReportHelper.onEventV3(
                "bd_convert_other_error",
                params
              )
            } catch (e: Exception) {
              Log.e(TAG, "report bd_convert_other_error error", e)
            }
          }

          /**
           * 事件发送成功
           */
          override fun onEventSendSuccess(
            eventName: String,
            requestId: String
          ) {
            Log.d(
              TAG,
              "onEventSendSuccess eventName=$eventName requestId=$requestId"
            )

            try {
              val params = JSONObject()
              params.put("callback", "onEventSendSuccess")
              params.put("event_name", eventName)
              params.put("request_id", requestId)

              ConvertReportHelper.onEventV3(
                "bd_convert_event_send_success",
                params
              )
            } catch (e: Exception) {
              Log.e(TAG, "report bd_convert_event_send_success error", e)
            }
          }

          /**
           * 事件发送失败
           *
           * reason 对照：
           * -1 未知错误，需要根据 throwable 判断
           * 3  重复调用 sendLaunchEvent，仅允许一次调用
           * 4  构造参数发生错误，需要根据 throwable 判断
           * 5  网络请求发生错误，需要根据 throwable 判断
           * 6  获取 android_id 时发生错误，需要根据 throwable 判断
           */
          override fun onEventSendFailure(
            eventName: String,
            reason: Int,
            requestId: String,
            throwable: Throwable?
          ) {
            Log.e(
              TAG,
              "onEventSendFailure eventName=$eventName reason=$reason requestId=$requestId",
              throwable
            )

            try {
              val params = JSONObject()
              params.put("callback", "onEventSendFailure")
              params.put("event_name", eventName)
              params.put("reason", reason)
              params.put("reason_msg", getBDConvertReasonText(reason))
              params.put("request_id", requestId)
              params.put("error_msg", throwable?.message ?: "")

              ConvertReportHelper.onEventV3(
                "bd_convert_event_send_failure",
                params
              )
            } catch (e: Exception) {
              Log.e(TAG, "report bd_convert_event_send_failure error", e)
            }
          }
        }
      }

      BDConvert.init(this, config)

      Log.d(TAG, "BDConvert init called in Application")
    } catch (e: Exception) {
      Log.e(TAG, "BDConvert init exception", e)

      try {
        val params = JSONObject()
        params.put("callback", "initBDConvertForCheck")
        params.put("error_msg", e.message ?: "")

        ConvertReportHelper.onEventV3(
          "bd_convert_init_exception",
          params
        )
      } catch (reportError: Exception) {
        Log.e(TAG, "report bd_convert_init_exception error", reportError)
      }
    }
  }

  /**
   * BDConvert 回调 reason 对照
   */
  private fun getBDConvertReasonText(reason: Int): String {
    return when (reason) {
      -1 -> "未知错误，需要根据 throwable 进一步判断"
      1 -> "重复初始化，仅允许一次初始化"
      2 -> "在非主线程使用了初始化方式 B"
      3 -> "重复调用 sendLaunchEvent，仅允许一次调用"
      4 -> "构造参数发生错误，需要根据 throwable 进一步判断"
      5 -> "网络请求发生错误，需要根据 throwable 进一步判断"
      6 -> "获取 android_id 时发生错误，需要根据 throwable 进一步判断"
      else -> "未知 reason"
    }
  }
}