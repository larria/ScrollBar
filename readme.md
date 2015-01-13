# ScrollBar.js - 模拟滚动条

### 特性

- 支持竖向(v)、横向(h)、自动双向(auto)三种方向设置

- 支持自动检查容器大小变化而重新调整(多用于图片加载，ajax填充内容等)

- 支持响应鼠标滚轮，触屏设备的touch行为

### 资源引用

``` html
<link rel="stylesheet" href="src/ScrollBar.css">
<script src="src/ScrollBar-min.js"></script>
```

### 初始化参数

- **wrapId** : 初始化外层容器，也可直接传入dom

- dir : 设置滚动方向，可选值：'v'-纵向，'h'-横向，'auto'-自动

- autoFix : 设置为true将根据滚动内容的变化(如: 滚动内容含有未内联size的图片需要加载，ajax填充内容等情形)自动调整滚动条状态 : 组件实例渲染完毕回调

### 公有方法

- scrollTo : 手动调整到自定义位置，需显式传入两个参数，参数一为滚动位置的百分比，参数二为是否纵向滚动条。

- refresh : 用于更新滚动条视图及状态(通常当滚动内容有变化，如实例化完成后有图片加载，ajax填充内容等手动调用)。

------------

### [demo](index.html)

##### 示例1：简单调用```

``` javascript
new ScrollBar({
    wrapId : 'scroll_w0',
    dir : 'v',
    autoFix : true
});
```

##### 示例2：创建滚动实例并手动调整到50%的位置``````

``` javascript
var s = new ScrollBar({
    wrapId : 'scroll_w0',
    dir : 'v',
    autoFix : true
});
s.scrollTo(0.5, 1)
```