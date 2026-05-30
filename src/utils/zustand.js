//import useAuthStore from '../../hooks/store'
import { create } from 'zustand'

// 定义全局状态
const useAuthStore = create((set) => ({
  isLogin: false, //登陆状态
  message: false, //im状态
  privacyAgreed: false, //隐私协议状态
    // 商品管理页刷新标记
  shopManageRefreshKey: 0,
    // 订单页刷新标记
  orderRefreshKey: 0,
    // 订单tab列表页刷新标记
  orderListRefreshKey: 0,

    // ⭐总未读数
  unreadTotal: 0,

  isNewmessage: false,
  
  // 登录切换
  loginChanged: () => set((state)=>({ isLogin: !state.isLogin})),
    // im状态切换
  messageChanged: () => set((state)=>({ message: !state.message})),
    // 隐私协议状态切换
    setPrivacyAgreed: (value) =>
    set(() => ({ privacyAgreed: value })),
    
  // 触发商品管理刷新
  triggerShopManageRefresh: () =>
    set((state) => ({
      shopManageRefreshKey: state.shopManageRefreshKey + 1,
    })),

      // 触发订单刷新
  triggerOrderRefresh: () =>
    set((state) => ({
      orderRefreshKey:
        state.orderRefreshKey + 1,
    })),
      // 触发订单tab列表刷新
  triggerListOrderRefresh: () =>
    set((state) => ({
      orderListRefreshKey:
        state.orderListRefreshKey + 1,
    })),
      // ⭐设置总未读数
  setUnreadTotal: (value) =>
    set(() => ({
      unreadTotal: value,
    })),
  // 新消息切换
  isNewmessageChanged: () => set((state)=>({ isLogin: !state.isNewmessage})),

    
}))

export default useAuthStore
