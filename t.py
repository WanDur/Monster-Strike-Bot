ms_bot = Bot()
i = 0

while 1:
    i += 1

    def full_menu_control():
        ms_bot.clicker('PressExtendedTrain')
        ms_bot.clicker('singleplayer')
        error = ms_bot.waitandclick()
        if error == False:
            counter -= 1
            sleep(2)
            ms_bot.clicker('bottommainmenu')
            main()

    def skipped_menu_control():
        sleep(.5)
        ms_bot.clicker('setshortcut')
        ms_bot.clicker('shortcut')
        error = ms_bot.waitandclick()
        if error == False:
            counter -= 1
            sleep(2)
            ms_bot.clicker('bottommainmenu')
            main()

    skipped_menu_control() if i >= 2 else full_menu_control()
