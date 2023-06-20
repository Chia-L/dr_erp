/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'semi': ['warn', 'never'],           // 禁止尾部使用分号
    'no-console': 'warn',                // 禁止出现console
    'no-debugger': 'warn',               // 禁止出现debugger
    'no-duplicate-case': 'warn',         // 禁止出现重复case
    'no-empty': 'warn',                  // 禁止出现空语句块
    'no-extra-parens': 'warn',           // 禁止不必要的括号
    'no-func-assign': 'warn',            // 禁止对Function声明重新赋值
    'no-else-return': 'warn',            // 禁止if语句中return语句之后有else块
    'no-lone-blocks': 'warn',            // 禁用不必要的嵌套块
    'no-multi-spaces': 'warn',           // 禁止使用多个空格
    'no-mixed-spaces-and-tabs': 'warn',  // 禁止空格和tab的混合缩进
    'no-multiple-empty-lines': 'warn',   // 禁止出现多行空行
    'no-trailing-spaces': 'warn',        // 禁止一行结束后面不要有空格
    'no-useless-escape': 'off',
    'default-case': 'warn',              // 要求switch语句中有default分支
    'eqeqeq': 'warn',                    // 要求使用 === 和 !==
    'space-in-parens': 'warn',           // 要求在圆括号内使用一致的空格
    'space-infix-ops': 'warn',           // 要求操作符周围有空格
    'space-unary-ops': 'warn',           // 要求在一元操作符前后使用一致的空格
    'arrow-spacing': 'warn',             // 要求箭头函数的箭头前后使用一致的空格
    'array-bracket-spacing': 'warn',     // 要求数组方括号中使用一致的空格
    'brace-style': 'warn',               // 要求在代码块中使用一致的大括号风格
    'indent': ['warn', 2],               // 要求使用JS一致缩进4个空格
    "quotes": ["warn", "single", "avoid-escape"],      // 要求统一使用单引号符号
    "vue/singleline-html-element-content-newline": 0,  // 关闭单行元素必须换行符
    "vue/multiline-html-element-content-newline": 0,   // 关闭多行元素必须换行符
    'vue/multi-word-component-names': "off",
    // 要求每一行标签的最大属性不超五个
    'vue/max-attributes-per-line': ['warn', { singleline: 5 }],
    // 要求html标签的缩进为需要4个空格
    "vue/html-indent": ["warn", 2, {
      "attribute": 1,
      "baseIndent": 1,
      "closeBracket": 0,
      "alignAttributesVertically": true,
      "ignores": []
    }],
    // 取消关闭标签不能自闭合的限制设置
    "vue/html-self-closing": 'off'
  }
}
