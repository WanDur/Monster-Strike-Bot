# Monster Strike Bot v1.8

This script perform action only by ratio in the game. It won't read or write any game data.

# Table of Contents
  - [Getting started](#getting-started)
  - [How To Use](#how-to-use)
  - [Versions](#versions)

## Getting started

1. Clone the repository or download it
   ```sh
   git clone https://github.com/WanDur/Monster-Strike-Bot.git
   ```
2. Install required packages and python
   ```sh
   pip install -r requirements.txt
   ```
3. NoxPlayer is recommended.
## How To Use

Please finish all steps in [Getting started](#getting-started) first.  
Make sure all files are under the same folder (Monster-Strike-Bot).
1. Open NoxPlayer and enter the game main menu
2. Use SizeReference.exe to set a proper resolution for the emulator.  
![image](https://github.com/WanDur/Monster-Strike-Bot/blob/main/img/md/1.png)
3. Run launcher.exe  
Option 2 [Launch bot with check] is recommended for the first run.  
Adjust your game screen size until you see "Game found".  
You can use option 1 if you have set the size already by SizeReference.exe.
4. 每輪開始前都會有五秒暫停時間  
如果要結束program就按 ctrl + c 或者直接關掉程式

## Versions
- 1.8
  - added new launch mode and modified the launcher
- 1.7
  - check update automatically (new libraries required)
- 1.6
  - show total time spent
  - shoot faster
- 1.5
  - created function that can run remaining code once the lag is finished
  - added card.png for the new function
- 1.4
  - updated for ver. 25.0
  - 使用進階捷徑
- 1.3
  - added more shooting angles
  - all shoots start from the middle
  - record time
  - auto detect window size and position (removed WindowSizeChecker.exe)
  - more precise clicks
- 1.2
  -  shoot faster
- 1.1
  - 增加長按返回上一次冒險的功能
  - added support to two more resolutions
- 1.0
  - initial release (自動打訓練)
