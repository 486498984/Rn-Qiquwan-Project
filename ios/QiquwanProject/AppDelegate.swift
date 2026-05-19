import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import RNBootSplash


@main
class AppDelegate: UIResponder, UIApplicationDelegate,WXApiDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "QiquwanProject",
      in: window,
      launchOptions: launchOptions
    )
RNTUmengAnalytics.`init`("69c9da229a7f376488a93922", channel: "App Store", debug: false)
    return true
  }

func application(
  _ app: UIApplication,
  open url: URL,
  options: [UIApplication.OpenURLOptionsKey : Any] = [:]
) -> Bool {

  let urlString = url.absoluteString

  print("openURL:", urlString)

  let optionsDict = options.reduce(into: [String: Any]()) { result, item in
    result[item.key.rawValue] = item.value
  }

  // ✅ 微信
  if urlString.hasPrefix("wx") || urlString.contains("wechat") {

    print("命中微信 URL")

    RCTLinkingManager.application(app, open: url, options: options)

    return WXApi.handleOpen(url, delegate: self)
  }

  // ✅ 支付宝
  if urlString.hasPrefix("alipay") {

    print("命中支付宝 URL")

    return RNTAlipay.handleOpenURL(
      app,
      open: url,
      options: optionsDict
    )
  }

  // ✅ RN DeepLink
  return RCTLinkingManager.application(app, open: url, options: options)
}



}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
      override func customize(_ rootView: RCTRootView) {
    super.customize(rootView)
    RNBootSplash.initWithStoryboard("BootSplash", rootView: rootView)
  }
}
