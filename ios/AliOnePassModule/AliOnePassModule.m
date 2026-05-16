#import "AliOnePassModule.h"
#import <ATAuthSDK/ATAuthSDK.h>
#import <React/RCTUtils.h>

@interface AliOnePassModule()

@property (nonatomic, strong) TXCustomModel *customModel;
@property (nonatomic, assign) BOOL tokenPromiseResolved;

@end

@implementation AliOnePassModule

RCT_EXPORT_MODULE();

#pragma mark - 设置SDK密钥
RCT_EXPORT_METHOD(setAuthSDKInfo:(NSString *)info
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    [[TXCommonHandler sharedInstance] setAuthSDKInfo:info complete:^(NSDictionary * _Nonnull resultDic) {
        NSError *error;
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:resultDic options:0 error:&error];
        if (!jsonData) {
            reject(@"500", @"JSON序列化失败", error);
            return;
        }
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        resolve(jsonString);
    }];
}
// 生成圆角背景图
- (UIImage *)imageWithColor:(UIColor *)color size:(CGSize)size cornerRadius:(CGFloat)cornerRadius {
    CGRect rect = CGRectMake(0, 0, size.width, size.height);
    UIGraphicsBeginImageContextWithOptions(size, NO, 0);
    UIBezierPath *path = [UIBezierPath bezierPathWithRoundedRect:rect cornerRadius:cornerRadius];
    [color setFill];
    [path fill];
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return image;
}
#pragma mark - 设置授权页UI
RCT_EXPORT_METHOD(setAuthUI:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        TXCustomModel *model = [[TXCustomModel alloc] init];
        
        model.loginBtnText = [[NSAttributedString alloc] initWithString:@"本机号码一键登录"
                                                             attributes:@{NSForegroundColorAttributeName: UIColor.whiteColor,
                                                                          NSFontAttributeName: [UIFont systemFontOfSize:20.0]}];
        model.logoImage = [UIImage imageNamed:@"applogo"];
        model.logoIsHidden = NO;
        // logo 大小和位置
// model.logoFrameBlock = ^CGRect(CGSize screenSize, CGSize superViewSize, CGRect frame) {
//     return CGRectMake((screenSize.width - 80) / 2, 100, 85, 85);
// };
// model.logoFrameBlock = ^CGRect(CGSize screenSize, CGSize superViewSize, CGRect frame) {
//     CGFloat width = 85;
//     CGFloat height = 85;
    
     //CGFloat top = screenSize.height * 0.12; // 12% 屏幕高度
    
//     return CGRectMake((screenSize.width - width) / 2,  width, height);
// };
        model.privacyNavBackImage = [UIImage imageNamed:@"icon_nav_back_gray"];
// model.privacyFrameBlock = ^CGRect(CGSize screenSize, CGSize superViewSize, CGRect frame) {
//     //CGFloat paddingTop = 100; // 离上方偏移
//     CGFloat customWidth = superViewSize.width - 100; // 宽度比父视图小
    
//     CGFloat x = (superViewSize.width - customWidth) / 2; // 居中
//     CGFloat y = frame.origin.y - 300; // 原 frame 往上 10 pt
    
//     return CGRectMake(x, y, customWidth, frame.size.height);
// };
// model.privacyFrameBlock = ^CGRect(CGSize screenSize, CGSize superViewSize, CGRect frame) {

//     CGFloat bottomSafe = 30; // 距离底部安全距离
//     CGFloat height = frame.size.height;

//     CGFloat y = superViewSize.height - height - bottomSafe;

//     return CGRectMake(20, y, superViewSize.width - 40, height);
// };

model.privacyAlignment = NSTextAlignmentCenter;
        model.navColor = [UIColor whiteColor];
        model.navTitle = [[NSAttributedString alloc] initWithString:@""];
        model.checkBoxIsHidden = NO;
        model.autoHideLoginLoading = NO;
        
        model.privacyOne = @[@"《用户协议》", @"https://tourok.com.cn/policy/user.html"];
        model.privacyTwo = @[@"《隐私政策》", @"https://tourok.com.cn/policy/privacy.html"];
        model.numberColor = UIColor.blackColor;
        model.numberFont = [UIFont systemFontOfSize:30];
        model.supportedInterfaceOrientations = UIInterfaceOrientationMaskPortrait;
        model.changeBtnIsHidden = YES;

UIColor *orangeColor = [UIColor colorWithRed:1.0 green:0.584 blue:0.0 alpha:1.0];

// 使用示例
CGFloat btnHeight = 54;
CGFloat btnWidth = 323;
CGFloat cornerRadius = btnHeight / 2; // 圆角

UIImage *activeImg = [self imageWithColor:orangeColor size:CGSizeMake(btnWidth, btnHeight) cornerRadius:cornerRadius];
UIImage *disabledImg = [self imageWithColor:orangeColor size:CGSizeMake(btnWidth, btnHeight) cornerRadius:cornerRadius];
UIImage *highlightImg = [self imageWithColor:orangeColor size:CGSizeMake(btnWidth, btnHeight) cornerRadius:cornerRadius];

model.loginBtnBgImgs = @[activeImg, disabledImg, highlightImg];
model.privacyAlertIsNeedShow = YES;
// 设置按钮 frame
model.loginBtnFrameBlock = ^CGRect(CGSize screenSize, CGSize superViewSize, CGRect frame) {
    CGFloat x = (superViewSize.width - btnWidth) / 2;
    CGFloat y = frame.origin.y; // 默认y 或自定义
    return CGRectMake(x, y, btnWidth, btnHeight);
};
        self.customModel = model;
        self.tokenPromiseResolved = NO; // 初始化标志位


            //model.privacyAlignment = NSTextAlignmentRight;
    model.privacyAlertIsNeedShow = YES;
    model.privacyAlertMaskAlpha = 0.5;
    model.privacyAlertMaskColor = UIColor.blackColor;
    model.privacyAlertCornerRadiusArray = @[@10,@10,@10,@10];
    model.privacyAlertBackgroundColor = UIColor.whiteColor;
    model.privacyAlertAlpha = 1.0;
    model.privacyAlertTitleBackgroundColor = UIColor.whiteColor;
    model.privacyAlertContentBackgroundColor = UIColor.whiteColor;
    model.privacyAlertTitleFont = [UIFont systemFontOfSize:16];
    model.privacyAlertTitleColor = UIColor.blackColor;
    model.privacyAlertContentColors = @[UIColor.grayColor, UIColor.orangeColor];
    model.privacyAlertContentAlignment = NSTextAlignmentCenter;
CGFloat buttonHeight = 120;
CGFloat cornerbRadius = 60;
CGFloat buttonWidth = UIScreen.mainScreen.bounds.size.width - 2 * 18;

UIImage *activeImage = [self imageWithColor:orangeColor size:CGSizeMake(buttonWidth, buttonHeight) cornerRadius:cornerbRadius];
UIImage *highlightImage = [self imageWithColor:orangeColor size:CGSizeMake(buttonWidth, buttonHeight) cornerRadius:cornerbRadius];
model.privacyAlertBtnBackgroundImages = @[activeImage, highlightImage];
    model.privacyAlertButtonTextColors = @[UIColor.whiteColor,UIColor.blueColor];
    model.privacyAlertButtonFont = [UIFont systemFontOfSize:18];
    model.privacyAlertCloseButtonIsNeedShow = YES;
    model.privacyAlertMaskIsNeedShow = YES;
    model.privacyAlertIsNeedAutoLogin = NO;
    model.tapPrivacyAlertMaskCloseAlert = YES;
    model.expandAuthPageCheckedScope = YES;
    model.privacyAlertCloseButtonIsNeedShow = YES;
    model.privacyAlertTitleFrameBlock = ^CGRect(CGSize screenSize, CGSize superViewSize, CGRect frame) {
        return CGRectMake(0, 20, frame.size.width, frame.size.height);
    };
    model.privacyAlertPrivacyContentFrameBlock = ^CGRect(CGSize screenSize, CGSize superViewSize, CGRect frame) {
        return CGRectMake(0, frame.origin.y+10, frame.size.width, frame.size.height);
    };
    model.privacyAlertButtonFrameBlock = ^CGRect(CGSize screenSize, CGSize superViewSize, CGRect frame) {
        return CGRectMake(frame.origin.x,superViewSize.height - 50 - 20, frame.size.width, 50);;
    };
    model.privacyAlertFrameBlock = ^CGRect(CGSize screenSize, CGSize superViewSize, CGRect frame) {
        return CGRectMake(40, (superViewSize.height - 150)*0.5, screenSize.width-80, 160);
    };
        resolve(@"Auth UI 设置成功");
        NSLog(@"logo image: %@", model.logoImage);
    });
}

#pragma mark - 获取登录Token（避免多次 resolve）
RCT_EXPORT_METHOD(getLoginToken:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        UIViewController *rootVC = RCTPresentedViewController();
        
        // 定义一个标记，保证 promise 只 resolve/reject 一次
        __block BOOL hasResolved = NO;
        
        [[TXCommonHandler sharedInstance] getLoginTokenWithTimeout:3.0
                                                         controller:rootVC
                                                              model:self.customModel
                                                           complete:^(NSDictionary * _Nonnull resultDic) {
            
            NSLog(@"一键登录原生结果：%@", resultDic);
         
            if (hasResolved) return; // 防止多次调用
            NSString *resultCode = resultDic[@"resultCode"];
            if ([resultCode isEqualToString:@"600000"]) {
                // 成功拿到 token
                [[TXCommonHandler sharedInstance] cancelLoginVCAnimated:YES complete:nil];
                hasResolved = YES;
                
                NSString *token = resultDic[@"token"] ?: @"";
                NSDictionary *res = @{@"token": token, @"requestId": resultDic[@"requestId"] ?: @""};
                
                NSError *error;
                NSData *jsonData = [NSJSONSerialization dataWithJSONObject:res options:0 error:&error];
                NSString *jsonString = jsonData ? [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding] : @"{}";
                resolve(jsonString);
                
            } else if ([resultCode isEqualToString:@"700000"] || [resultCode isEqualToString:@"600002"] || [resultCode isEqualToString:@"700020"]) {
                // 用户取消、授权页异常或未完成操作
                [[TXCommonHandler sharedInstance] cancelLoginVCAnimated:YES complete:nil];
                hasResolved = YES;
                
                NSError *error;
                NSData *jsonData = [NSJSONSerialization dataWithJSONObject:resultDic options:0 error:&error];
                NSString *jsonString = jsonData ? [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding] : @"{}";
                resolve(jsonString);
                
            } else if([resultCode isEqualToString:@"600004"]|| [resultCode isEqualToString:@"600011"]) {
                    // 其他未知状态
    [[TXCommonHandler sharedInstance] cancelLoginVCAnimated:YES complete:nil];
    hasResolved = YES;

    NSString *msg = resultDic[@"msg"] ?: @"未知错误";

    reject(resultCode, msg, nil);
                // 其他状态，不关闭授权页，也不 resolve，等待用户操作
                // NSLog(@"授权页状态：%@", resultDic);
            }
        }];
    });
}

#pragma mark - 关闭授权页
RCT_EXPORT_METHOD(quitLoginPage)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [[TXCommonHandler sharedInstance] cancelLoginVCAnimated:YES complete:nil];
    });
}

@end
