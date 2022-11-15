from bot import Bot, check_update
from time import sleep, time
from os import system

VERSION = '1.9'

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
        ms_bot.waitandclick()

    def skipped_menu_control():
        if ms_bot.found_image('shortcut') != True:
            sleep(.5)
            ms_bot.clicker('setshortcut')
        ms_bot.clicker('shortcut')
        ms_bot.waitandclick()

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

            print(f"Finished {main.counter}   打左{main.counter}舖\nreturned to menu, restart after {wait_time} seconds\n")
            print(f"Time spent {convert(end - start)}\nAverage: {round((end - start) / main.counter)} seconds")
            ms_bot.clicker('bottommainmenu')
            sleep(wait_time)
            main()

if check_update() == VERSION:
    print(f"Bot ----- v{VERSION}")
else:
    print(f'Your version is v{VERSION}, v{check_update()} is available!\nPlease update the bot.\n')

while 1:
    wait_time = int(input('How many second would you pause between each game (1-5): '))
    if wait_time < 1 or wait_time > 5:
        print('Invalid input, should be within 1 and 5')
        continue
    else:
        system('cls') 
        break

print("start in 3 seconds")
sleep(3)

ms_bot = Bot()
if ms_bot.found_image('level') != True:
    system('cls')
    print('The game is not on the screen or it is in wrong size!')
    sleep(2)
    exit(0)

# statistics
main.counter = 0
start = time()

# enter main loop
main()
