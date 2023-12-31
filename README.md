# Minna-de-Honyaku-Plugin
Tampermokey Plugins for Minna de Honyaku on DLsite.

---

基于Tampermokey的DLsite大家一起来翻译小插件。
仅适用于音声。

目标是一键上传。
目前写了一小步，欢迎交流。

目前的功能：

（半）自动填充差分音轨、导出字幕文件。

**使用方法：**

- 安装脚本。复制代码到脚本管理器。

- 首先完成第一个版本，即最上方版本的字幕。所有的自动填充均基于已完成的最上方版本字幕。

- (Beta)全自动填充：点击“一键填充差分”按钮，并勾选“全自动读入”。
这将会对剩余所有版本进行自动填充，直到完成或出错为止。若出现中断，中断后再次勾选“全自动读入”可以继续。（开发中，谨慎使用）

<img width="640" alt="ced9baab211135a4b626f8fa36c1e9b" src="https://github.com/235KH/Minna-de-Honyaku-Plugin/assets/130253989/106b4f90-40a7-46d4-ac46-79f2750edb5f">

- 半自动填充：仅勾选“全自动读入”，不点击“一键填充差分”。
点击需要填充的track后，会自动填充当前音轨并返回。

- Track界面自动填充：前页取消“全自动读入”，勾选“自动读入”，然后点击旁边的“翻訳データ読み込み”即可。

<img width="540" alt="d52aa99519b9345463cd10a26d666cb" src="https://github.com/235KH/Minna-de-Honyaku-Plugin/assets/130253989/e3dc6a57-0f51-4625-95de-2a9adf14383c">

- F12打开控制台查看脚本运行信息。

---

**Update**

0.8：增强了音轨名称匹配逻辑，针对带括号差分标题进行了优化。

0.81：微调了全自动读入的返回延迟。

---

已知bug:

字幕条数太多可能会导致E3错误过多。(0.81版本微调了返回延迟，可以解决大部分问题，但600行字幕以上仍有小概率报错)

Edit页面顺序若与Track页面内顺序不匹配可能会导致读入其他差分（默认读入第一版差分，请注意第一版完成后其他差分音轨有无日期变化）。
