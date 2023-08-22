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



