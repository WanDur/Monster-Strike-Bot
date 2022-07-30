# Monster Strike Bot

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
## How To Use

Please finish all steps in [Getting started](#getting-started) first.  
Make sure all files are under the same folder.
1. Run WindowSizeChecker.exe (a file named [data] will be created)  
![image](img\md\1.png)  
圈住遊戲畫面 (不要包括最頂狀態列)  
按左上角Save (建議調整遊戲窗口大小至 326x566 / 452x782 / 550x948 附近)  
![image](img\md\2.png)

2. 不要再更改遊戲視窗大小及位置
3. Run ```main.py```  
每輪開始前都會有五秒暫停時間  
如果要結束program就按 ctrl + c

## Versions
- 1.0
  - initial release (自動打訓練)