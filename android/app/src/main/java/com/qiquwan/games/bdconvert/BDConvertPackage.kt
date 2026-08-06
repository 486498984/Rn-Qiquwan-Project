package com.qiquwan.games.bdconvert

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class BDConvertPackage : ReactPackage {

    override fun createNativeModules(
        reactContext: ReactApplicationContext
    ): List<NativeModule> {
        return listOf(BDConvertModule(reactContext))
    }

    override fun createViewManagers(
        reactContext: ReactApplicationContext
    ): List<ViewManager<*, *>> {
        return emptyList()
    }
}