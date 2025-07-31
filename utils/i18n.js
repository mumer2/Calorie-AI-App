import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import App from '../App';

const i18n = new I18n();

i18n.translations = {
  en: {
    settings: 'Settings',
    logout: 'Logout',
    profile: 'Profile',
    save: 'Save Changes',
    back: 'Back to Settings',
    editProfile: 'Edit Profile',
    enterName: 'Enter your name',
    nameEmpty: 'Name cannot be empty',
    nameUpdated: 'Your name has been updated',
    languageChanged: 'App language set to',
    confirmLogout: 'Are you sure you want to log out?',
    cancel: 'Cancel',
    language: 'Select Language',

    // App.js
     home: 'Home',
    checkin: 'Check-In',
    history: 'History',
    settings: 'Settings',
    login: 'Login',
    signup: 'Signup',
    coachHome: 'Coach Home',
    fitness: 'Fitness',
    diet: 'Diet Plan',
    exercise: 'Exercise',
    subscribe: 'Subscribe',
    steps: 'Step Counter',
    reminders: 'Reminders',
    stepHistory: 'Step History',
    training: 'Training',
    trainingDetail: 'Training Detail',
    trainingVideo: 'Training Video',
    progressReport: 'Progress Report',
    jitsi: 'Live Call',
    aiChat: 'AI Chat',
    reviewRequests: 'Review Requests',
    coachList: 'Coach List',
    coachProfile: 'Coach Profile',
    sendRequest: 'Send Request',
    coachVideoList: 'Coach Videos',
    coachLiveScreen: 'Live Coaching',
    coinsReward: 'Coins Reward',
    redeemScreen: 'Redeem',
    weChatPay: 'WeChat Pay',
    subWithCoins: 'Subscribe With Coins',
    subscriptionSuccess: 'Subscription Success',
    forgotPassword: 'Forgot Password',
    resetPassword: 'Reset Password',
    notifications: 'Notifications',
    applePay: 'Apple Pay',
    paypal: 'PayPal',

    // HomeScreen
     hi: "Hi",
  guest: "Guest",
  unsubscribe: "Unsubscribe",
  subscribe: "Subscribe",
  yourFitnessJourney: "Your Fitness Journey",
  fitnessCalculation: "Fitness Calculation",
  dietPlan: "Diet Plan",
  dailyWorkout: "Daily Workout",
  reminders: "Reminders",
  workoutGuide: "Workout Guide",
  progressReport: "Progress Report",
  liveVideo: "Live Video",
  aiChat: "AI Chat",
  sendRequest: "Send Request To Coach",

//   DietPlan
recommendedDietPlan: "🥗 Recommended Diet Plan",

  breakfast: "🍳 Breakfast",
  lunch: "🍛 Lunch",
  dinner: "🍲 Dinner",
  snacks: "🍌 Snacks",

  oatsMilkFruits: "Oats with milk & fruits - 350 kcal",
  boiledEggsToast: "Boiled eggs & toast - 300 kcal",
  greekYogurtNuts: "Greek yogurt & nuts - 250 kcal",

  grilledChickenRiceVeggies: "Grilled chicken with rice & veggies - 500 kcal",
  dalRotiSalad: "Dal, roti, salad - 450 kcal",
  quinoaChickpeas: "Quinoa with chickpeas - 400 kcal",

  stirFriedTofuRice: "Stir-fried tofu with brown rice - 450 kcal",
  paneerSaladBowl: "Paneer salad bowl - 400 kcal",
  soupWholeGrainBread: "Soup with whole grain bread - 350 kcal",

  fruitSmoothie: "Fruit smoothie - 200 kcal",
  nutsDryFruits: "Nuts & dry fruits - 150 kcal",
  boiledCornSprouts: "Boiled corn or sprouts - 100 kcal",

  checkingSubscription: "Checking subscription...",


  // AI CHAT SCREEN
   aiChatTitle: "AI Chat",
    askPlaceholder: "Ask about workouts, diet...",
    send: "Send",
    thinking: "CoachBot is thinking...",
    errorFetch: "Sorry, failed to fetch answer.",
    you: "You",
    coachbot: "CoachBot",

  },
  zh: {
    settings: '设置',
    logout: '登出',
    profile: '个人资料',
    save: '保存更改',
    back: '返回设置',
    editProfile: '编辑资料',
    enterName: '请输入你的名字',
    nameEmpty: '名字不能为空',
    nameUpdated: '你的名字已更新',
    languageChanged: '语言已设置为',
    confirmLogout: '您确定要退出登录吗？',
    cancel: '取消',
    language: '选择语言',

    // App.js
    home: '首页',
    checkin: '签到',
    history: '历史记录',
    settings: '设置',
    login: '登录',
    signup: '注册',
    coachHome: '教练主页',
    fitness: '健身',
    diet: '饮食计划',
    exercise: '锻炼',
    subscribe: '订阅',
    steps: '步数统计',
    reminders: '提醒事项',
    stepHistory: '步数历史',
    training: '训练',
    trainingDetail: '训练详情',
    trainingVideo: '训练视频',
    progressReport: '进度报告',
    jitsi: '视频通话',
    aiChat: 'AI 聊天',
    reviewRequests: '审核请求',
    coachList: '教练列表',
    coachProfile: '教练资料',
    sendRequest: '发送请求',
    coachVideoList: '教练视频',
    coachLiveScreen: '教练直播',
    coinsReward: '奖励金币',
    redeemScreen: '兑换',
    weChatPay: '微信支付',
    subWithCoins: '用金币订阅',
    subscriptionSuccess: '订阅成功',
    forgotPassword: '忘记密码',
    resetPassword: '重置密码',
    notifications: '通知',
    applePay: 'Apple Pay',
    paypal: 'PayPal',
// Home Screen
 hi: "你好",
  guest: "游客",
  unsubscribe: "取消订阅",
  subscribe: "订阅",
  yourFitnessJourney: "你的健身旅程",
  fitnessCalculation: "健身计算",
  dietPlan: "饮食计划",
  dailyWorkout: "每日锻炼",
  reminders: "提醒事项",
  workoutGuide: "锻炼指南",
  progressReport: "进度报告",
  liveVideo: "直播视频",
  aiChat: "AI 聊天",
  sendRequest: "发送请求给教练",
  confirmUnsubscribeTitle: "确认取消订阅",
  confirmUnsubscribeText: "你确定要取消订阅吗？",
  cancel: "取消",

//   DietPlan
recommendedDietPlan: "🥗 推荐饮食计划",

  breakfast: "🍳 早餐",
  lunch: "🍛 午餐",
  dinner: "🍲 晚餐",
  snacks: "🍌 小吃",

  oatsMilkFruits: "牛奶水果燕麦 - 350 千卡",
  boiledEggsToast: "水煮蛋和吐司 - 300 千卡",
  greekYogurtNuts: "希腊酸奶和坚果 - 250 千卡",

  grilledChickenRiceVeggies: "烤鸡配米饭和蔬菜 - 500 千卡",
  dalRotiSalad: "扁豆、印度饼和沙拉 - 450 千卡",
  quinoaChickpeas: "藜麦和鹰嘴豆 - 400 千卡",

  stirFriedTofuRice: "炒豆腐配糙米 - 450 千卡",
  paneerSaladBowl: "奶酪沙拉碗 - 400 千卡",
  soupWholeGrainBread: "汤配全麦面包 - 350 千卡",

  fruitSmoothie: "水果奶昔 - 200 千卡",
  nutsDryFruits: "坚果和干果 - 150 千卡",
  boiledCornSprouts: "煮玉米或豆芽 - 100 千卡",

  checkingSubscription: "正在检查订阅...",
  // AI CHAT SCREEN
      aiChatTitle: "AI 聊天",
    askPlaceholder: "请输入有关锻炼、饮食的问题...",
    send: "发送",
    thinking: "教练机器人正在思考...",
    errorFetch: "对不起，无法获取答案。",
    you: "你",
    coachbot: "教练机器人",


  },
};

i18n.fallbacks = true;
i18n.locale = Localization.locale || 'en';

export default i18n;
