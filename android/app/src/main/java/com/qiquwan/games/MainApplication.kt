package com.qiquwan.games

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.github.reactnativehero.umenganalytics.RNTUmengAnalyticsModule
import com.github.reactnativehero.umenganalytics.RNTUmengAnalyticsPackage
import android.content.pm.PackageManager


class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // add(MyReactNativePackage())
          add(com.qiquwan.games.alionepass.AliOnePassPackage())
        },
    )
  }

  override fun onCreate() {
    super.onCreate()
    val appInfo = packageManager.getApplicationInfo(packageName, PackageManager.GET_META_DATA)
    val metaData = appInfo.metaData
    RNTUmengAnalyticsModule.init(this, metaData, false)
    loadReactNative(this)
  }
}
