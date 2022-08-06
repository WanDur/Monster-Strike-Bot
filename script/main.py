from bot import Bot
from time import sleep, time
from os import system

VERSION = '1.3'

def main():
    '''
    main loop of the bot
    '''
    main.counter += 1
    InBattle = InResultPage = False
    
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
            ms_bot.clicker('startBtn')

    print("In result page   結算中. . .")

    while InResultPage == True:
        ms_bot.clicker('menuspamclick')
        sleep(.5)
        _found = ms_bot.found_image('level')
        if _found is not None:
            InResultPage = False
            system('cls')
            end = time()

            print(f"Finished {main.counter}   打左{main.counter}舖\nreturned to menu, restart after 5 seconds\n")
            print(f"Average: {round((end - start) / main.counter)} seconds")
            ms_bot.clicker('bottommainmenu')
            sleep(5)
            main()


print(f"Bot ----- v{VERSION}")
print("start in 5 seconds, make sure the game is on the screen!")
sleep(5)

ms_bot = Bot()

# statistics
main.counter = 0
start = time()

# enter main loop
main()
