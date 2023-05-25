module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: [
        "Chrome > 31",
        "ff > 31",
        "ie >= 8",
        "last 10 versions" // 所有主流浏览器最近10版本用
      ],
      grid: true
    },
    "postcss-pxtorem": {
      rootValue: 192, // 设计稿宽度 / 10
      propList: ["*", "!border"], // 除 border 外所有px 转 rem
      selectorBlackList: [".el-", "vxe-", "ivu-"], // 过滤掉.el-开头的class，不进行rem转换
      mediaQuery: false, //媒体查询( @media screen 之类的)中不生效
      minPixelValue: 12, // 小于12px的不会被转换
      unitPrecision: 5, //保留rem小数点多少位
    }
  }
};
