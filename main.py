import pyautogui
import time
from bot import Bot


def main():
    '''
    main loop of the bot
    '''
    main.counter += 1
    InBattle: bool
    InResultPage: bool
    try:
        file = open("data", "r")
        datas = file.read().split(' ')
    except:
        print("data file not found\nPlease run WindowSizeChecker.exe")
        exit(1)

    dx = int(datas[0])
    dy = int(datas[1]) + 20
    height = int(datas[3]) - int(datas[1])
    width = int(datas[2]) - int(datas[0])

    ms_bot = Bot(dx, dy, height, width)

    def menu_control():
        ms_bot.clicker('mainmenu')
        ms_bot.clicker('threesubmenu')
        ms_bot.clicker('trainingmenu')
        ms_bot.clicker('selectbigtrain')
        ms_bot.clicker('selectsmalltrain')
        ms_bot.clicker('singleplayer')
        ms_bot.clicker('selectmonster')
        ms_bot.clicker('startbattle')
    menu_control()

    print("Battle started   打緊. . .")

    InBattle = True
    while InBattle == True:
        ms_bot.shoot()
        _pos = pyautogui.locateOnScreen(r"img\ok_452x782.png", confidence=0.8)
        if _pos is not None:
            InBattle = False
            InResultPage = True

    print("In result page   結算中. . .")

    while InResultPage == True:
        ms_bot.clicker('startBtn')
        ms_bot.clicker('menuspamclick')
        time.sleep(1)
        _pos = pyautogui.locateOnScreen(
            r"img\level_452x782.png", confidence=0.8)
        if _pos is not None:
            InResultPage = False
            print(
                f"\n\nFinished {main.counter}   打左{main.counter}舖\nreturned to menu, restart after 5 secs\n")
            ms_bot.clicker('bottommainmenu')
            time.sleep(5)
            main()


main.counter = 0
print("start in 5 secs")
time.sleep(5)
main()
