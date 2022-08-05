from time import sleep
from bot import Bot
from os import system

while 1:
    ms_bot_test = Bot()

    if ms_bot_test.found_image('level'):
        print('Game found')
        print('Script is ready to run!')
        sleep(2)
        exit(0)
    else:
        print('Game not found, adjust your window size.\n')
        print('未能找到遊戲, 請調整遊戲窗口大小\n')
        sleep(1)
        system('cls')