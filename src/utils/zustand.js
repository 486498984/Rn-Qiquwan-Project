//import useAuthStore from '../../hooks/store'
import { create } from 'zustand'

// 定义全局状态
const useAuthStore = create((set) => ({
  isLogin: false, //登陆状态
  message: false, //im状态
  privacyAgreed: false, //隐私协议状态
    // 商品管理页刷新标记
  shopManageRefreshKey: 0,
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
}))

export default useAuthStore
