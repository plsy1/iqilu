## iqilu 静态源

## Vercel部署方式（任意播放器）

通过 GitHub Actions 自动抓取最新直播源，生成 M3U 文件。

通过 Vercel Serverless Function 提供 302 跳转。

直接导入播放器使用，无需额外配置。

### 部署方法

1. 克隆本仓库
2. 点击下面按钮，创建 Project，选择刚刚克隆的仓库进行部署
3. 在克隆的仓库里开启 Actions
4. 修改 config.json 文件中 baseUrl-ku9 的值，Actions 会自动运行，生成新的 m3u
5. 复制 m3u 文件，导入播放器播放

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com)

## 酷9播放器JS脚本方式

直接导入 [iqilu-ku9.m3u](https://fastly.jsdelivr.net/gh/plsy1/iqilu@master/iqilu-ku9.m3u) 即可
