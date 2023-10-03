# Monster Strike Bot v3.2

This script is designed to automate actions in Monster Strike, but it does not interact with the game data. It operates solely by performing actions based on ratios.

# Table of Contents
  - [About](#about)
  - [Getting started](#getting-started)
  - [How To Use](#how-to-use)
  - [Versions](#versions)

## About
### Development environment
- Windows 11, screen resolution: 1920x1080
- Monster strike TW version
- NoxPlayer settings
  - Custom: CPU 6 core, Memory 8192 MB
  - Graphics rendering mode: Enhanced compatibility mode
  - Resolution setting: Mobile phone, 900x1600
  - Frame setting: 60
  - Mobile phone model: Default model (Samsung Galaxy S20 ultra)
  - Toolbar display: Only show the icon

### Python version
- easier to make custom changes
- more readable
- no features from v3.0

### C++ version
- much smaller build size than python

## Getting started

1. [Download](https://github.com/WanDur/Monster-Strike-Bot/releases/) the release folder (vX.X)
2. NoxPlayer is required (change the code otherwise)
## How To Use

1. Open NoxPlayer and enter the game's main menu.
2. Run MSBot.exe, and **make sure to bring back NoxPlayer to the front of the screen.**
3. Move your mouse to any corner of the screen to stop the bot, or simply close it.
4. You can check your bot status remotely at [here](https://msbot.pythonanywhere.com) where the UID required is printed on the terminal every time you run the bot.

## Versions
- 3.2
  - Updated for ver. 26.0
  - Improved shooting
- 3.1
  - All matching images are packed in one file
  - Added screenconfig class for dynamically changing variables related to screen resolution
  - Added `fullSpamClick()` to allow the bot to click different "ok" button in game
- 3.0
  - Rewrote the bot in c++ for overall improvement
  - Created custom API to check bot status

<details><summary>2.X</summary>

- 2.5
  - Minor fixes
  - Last version of python written bot
- 2.4
  - Logging is enabled by default
  - Cleaned up the directory
- 2.3
  - Added `logging` for debug mode
- 2.2
  - Code optimization
  - Small fixes
- 2.1
  - Small fixes
  - Improved error handling
- 2.0
  - Added a new launcher
  - Python files are packed into an .exe file and can be downloaded from the release section  
</details>
  
<details><summary>1.X</summary>

- 1.9
  - 1.9.2
    - Small fixes
  - 1.9.1
    - Small fixes
    - Added another click when returning to the menu
  - 1.9.0
    - Automatically uses advanced shortcuts
- 1.8
  - Added a new launch mode and modified the launcher
- 1.7
  - Automatically checks for updates (new libraries required)
- 1.6
  - Shows total time spent
  - Faster shooting
- 1.5
  - Created a function to run the remaining code once the lag is finished
  - Added card.png for the new function
- 1.4
  - Updated for ver. 25.0
  - Uses advanced shortcuts
- 1.3
  - Added more shooting angles
  - All shoots start from the middle
  - Records time
  - Automatically detects window size and position (WindowSizeChecker.exe removed)
  - Faster shooting
- 1.2
  - shoot faster
- 1.1
  - Added a long press feature to return to the last battle
  - Added support for two more resolutions
- 1.0
  - Initial release
</details>
