# 首页栈溢出排查记录

- 在 `/?from_webdev=1` 重新打开首页后，页面可正常渲染。
- 当前浏览器控制台为空，未即时复现 `Maximum call stack size exceeded`。
- 需要继续沿培训任务进入“当前工作”页的路径复测，判断是否为交互后触发的运行时错误。

修复后再次加载 `/?from_webdev=1`，首页主界面可正常显示，浏览器控制台为空，当前未再复现 `Maximum call stack size exceeded`。本轮修复点为：仅在 `appView === "home"` 时渲染 `HomePage`，避免在组织架构视图下继续并行挂载首页组件。
