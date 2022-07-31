from bot import Bot
from time import sleep


def get_screen_data():
    global datas

    try:
        file = open("data", "r")
        datas = file.read().split(' ')
    except:
        print("data file not found\nPlease run WindowSizeChecker.exe")
        exit(1)


def main():
    '''
    main loop of the bot
    '''
    main.counter += 1
    InBattle: bool
    InResultPage: bool

    dx = int(datas[0])
    dy = int(datas[1]) + 20
    height = int(datas[3]) - int(datas[1])
    width = int(datas[2]) - int(datas[0])

    ms_bot = Bot(dx, dy, height, width)

    def full_menu_control():
        ms_bot.clicker('mainmenu')
        ms_bot.clicker('threesubmenu')
        ms_bot.clicker('trainingmenu')
        ms_bot.clicker('selectbigtrain')
        ms_bot.clicker('selectsmalltrain')
        ms_bot.clicker('singleplayer')
        ms_bot.clicker('selectmonster')
        ms_bot.clicker('startbattle')

    def skipped_menu_control():
        ms_bot.longPress('mainmenu')
        ms_bot.clicker('selectsmalltrain')
        ms_bot.clicker('singleplayer')
        ms_bot.clicker('selectmonster')
        ms_bot.clicker('startbattle')

    skipped_menu_control() if main.counter >= 2 else full_menu_control()

    print("Battle started   打緊. . .")

    InBattle = True
    while InBattle == True:
        ms_bot.shoot()
        _found = ms_bot.found_image('ok')
        if _found:
            InBattle = False
            InResultPage = True

    print("In result page   結算中. . .")

    while InResultPage == True:
        ms_bot.clicker('startBtn')
        ms_bot.clicker('menuspamclick')
        sleep(1)
        _found = ms_bot.found_image('level')
        if _found is not None:
            InResultPage = False
            print(
                f"\n\nFinished {main.counter}   打左{main.counter}舖\nreturned to menu, restart after 5 seconds\n")
            ms_bot.clicker('bottommainmenu')
            sleep(5)
            main()


main.counter = 0
get_screen_data()
print("start in 5 seconds, make sure the game is on the screen!")
sleep(5)

main()
