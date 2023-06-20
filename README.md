```html
```



### 启动

```js
#node 版本
v18.16.0
#npm 版本
v9.5.1

#拉取依赖
npm i

#开发环境
npm run dev

#联调环境
npm run dock
```

### 规定约束

#### 界面

##### 显示

1.支持最小屏1360px

##### 表格

>位置：该项目所有表配置项放在`asset/table_config`

1.默认撑满，列宽最小宽度（minWidth）值是px，宽度（width）是百分比。

2.该项目所有表配置项放在`asset/table_config`

##### 滚动

1.所有滚动使用element的虚拟滚动，组件内的系统动统一使用一个类名

#### ui库

1. 表格使用vxe-table；
2. msgbox类弹窗使用`src/components/VxeBasicDlgComp.vue`，其余弹窗使用element-plus的；
3. 非必要尽量不要使用view-ui-plus库，使用时，按需引用。

### 技术

1.schema模板项目：drm_dashboard_json_schema

