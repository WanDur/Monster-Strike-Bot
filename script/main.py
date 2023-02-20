from bot import Bot
from time import sleep, time
from os import system
from threading import Thread

VERSION = '2.3'

def main():
    '''
    main loop of the bot
    '''
    main.counter += 1
    InBattle = InResultPage = False
    
    def convert(seconds):
        '''
        convert seconds to hour:minute:second
        '''
        seconds = seconds % (24 * 3600)
        hour = seconds // 3600
        seconds %= 3600
        minutes = seconds // 60
        seconds %= 60
            
        return "%d:%02d:%02d" % (hour, minutes, seconds)
    
    def full_menu_control():
        ms_bot.clicker('mainmenu')
        ms_bot.clicker('threesubmenu')
        ms_bot.clicker('trainingmenu')
        ms_bot.clicker('selectbigtrain')
        ms_bot.clicker('selectsmalltrain')
        ms_bot.clicker('singleplayer')
        error = ms_bot.waitandclick()
        if error == False:
            main.counter -= 1
            sleep(2)
            ms_bot.clicker('bottommainmenu')
            main()

    def skipped_menu_control():
        sleep(.5)
        ms_bot.clicker('setshortcut')
        ms_bot.clicker('shortcut')
        error = ms_bot.waitandclick()
        if error == False:
            main.counter -= 1
            sleep(2)
            ms_bot.clicker('bottommainmenu')
            main()

    skipped_menu_control() if main.counter >= 2 else full_menu_control()

    print("Battle started   打緊. . .")

    InBattle = True
    while InBattle:
        ms_bot.shoot()
        if ms_bot.found_image('ok'):
            InBattle = False
            InResultPage = True
            ms_bot.clicker('startBtn')

    print("In result page   結算中. . .")

    while InResultPage:
        ms_bot.clicker('menuspamclick')
        sleep(.5)
        if ms_bot.found_image('level'):
            InResultPage = False
            system('cls')
            end = time()
            ms_bot.clicker('bottommainmenu')

            print(f"Finished {main.counter}   打左{main.counter}舖\nreturned to menu, restart after 1 seconds\n")
            print(f"Time spent {convert(end - start)}\nAverage: {round((end - start) / main.counter)} seconds\n")
            sleep(1)
            main()

ms_bot = Bot()

# fetching data
def fetch_version_and_check():
    done = False
    def loading():
        while done == False:
            if done:
                break
            ms_bot.sysio_print('\rChecking version |')
            sleep(0.1)
            ms_bot.sysio_print('\rChecking version /')
            sleep(0.1)
            ms_bot.sysio_print('\rChecking version -')
            sleep(0.1)
            ms_bot.sysio_print('\rChecking version \\')
            sleep(0.1)
        system('cls')
        ms_bot.sysio_print('\rDone fetching!\n\n')

    t_load = Thread(target=loading)
    t_load.start()
    latest_version = ms_bot.check_update(VERSION)
    done = True
    sleep(1.5)

    if latest_version == VERSION:
        print(f"Bot ----- v{VERSION}")
    else:
        ms_bot.show_error_box(f'Your version is v{VERSION}, v{ms_bot.check_update(VERSION)} is available!\nPlease update the bot.\n')
        ms_bot.bot_exit()

fetch_version_and_check()

print("start in 3 seconds")
sleep(3)

if ms_bot.found_image('level') != True:
    system('cls')
    ms_bot.show_error_box('The game is not found on the screen or it is in wrong size!')
    ms_bot.bot_exit()

# statistics
main.counter = 0
start = time()

# enter main loop
main()
