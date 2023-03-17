from random import randint
from pyautogui import moveTo, dragTo, click, locateOnScreen
from win32gui import GetWindowRect, EnumWindows, GetWindowText
from time import sleep
import pywinauto
import requests
import sys
import ctypes


def callback(hwnd, extra):
    rect = GetWindowRect(hwnd)
    x = rect[0]
    y = rect[1]
    w = rect[2] - x
    h = rect[3] - y

    global window_stat
    # change the name of your emulator here
    if GetWindowText(hwnd) == '夜神模擬器' or GetWindowText(hwnd) == 'NoxPlayer':
        window_stat = (x, y, w, h)


EnumWindows(callback, None)


class Bot:
    def __init__(self):
        # initialize
        try:
            window_stat
        except:
            Bot.show_error_box("Emulator not found.")
            Bot.bot_exit()
        self.dx = window_stat[0]
        self.dy = window_stat[1]
        self.width = window_stat[2]
        self.height = window_stat[3]

        # menu ratio
        self.middleX = 0.45702
        self.mainmenuY = 0.79737
        self.threesubmenuX = 0.23659
        self.threesubmenuY = 0.63054
        self.trainingMenuY = 0.46673
        self.selecttrainAY = 0.35334
        self.selecttrainBY = 0.46972
        self.singleplayerX = 0.24165
        self.singleplayerY = 0.52870
        self.selectMonstY = 0.77319
        self.startBattleY = 0.69206
        self.okButtonX = 0.44864
        self.okButtonAY = 0.65455
        self.okButtonBY = 0.83179
        self.okButtonCY = 0.60866
        self.okButtonDY = 0.80645
        self.okButtonEY = 0.71197
        self.bottommenuX = 0.07945
        self.bottommenuY = 0.94682
        self.shortcutY = 0.74742
        self.setshortcutX = 0.44474
        self.setshortcutY = 0.70000
        self.shortcutbtnX = 0.12329
        self.shortcutbtnY = 0.56452

        # shoot reference position
        self.middle = (self.dx + self.width * 0.47384,
                       self.dy + self.height * 0.50636)
        self.a1 = (self.dx + self.width * 0.37209,
                   self.dy + self.height * 0.24335)
        self.a2 = (self.dx + self.width * 0.32267,
                   self.dy + self.height * 0.41907)
        self.a3 = (self.dx + self.width * 0.66957,
                   self.dy + self.height * 0.41907)
        self.a4 = (self.dx + self.width * 0.77519,
                   self.dy + self.height * 0.45260)
        self.a5 = (self.dx + self.width * 0.07946,
                   self.dy + self.height * 0.56878)
        self.a6 = (self.dx + self.width * 0.30233,
                   self.dy + self.height * 0.62254)
        self.a7 = (self.dx + self.width * 0.66957,
                   self.dy + self.height * 0.62254)

        self.posList = [self.a1, self.a2, self.a3,
                        self.a4, self.a5, self.a6, self.a7]

    def shoot(self):
        '''
        shoot randomly

        every shoot last for 1.9 seconds
        '''
        finalPos = self.posList[randint(0, 6)]
        moveTo(self.middle)
        sleep(.2)
        dragTo(finalPos, duration=0.1)

        sleep(1.6)

    def clicker(self, option: str):
        '''
        perform click action on the game screen
        '''
        def pos_cal(x: float, y: float):
            return (self.dx + self.width * x, self.dy + self.height * y)

        def click_pywinauto(x: float, y: float):
            pywinauto.mouse.press(button='left', coords=(
                int(self.dx + self.width * x), int(self.dy + self.height * y)))
            pywinauto.mouse.release(button='left', coords=(
                int(self.dx + self.width * x), int(self.dy + self.height * y)))
            return

        match option:
            case 'mainmenu':
                moveTo(pos_cal(self.middleX, self.mainmenuY))
                click()
                sleep(1)
            case 'threesubmenu':
                moveTo(pos_cal(self.threesubmenuX, self.threesubmenuY))
                click()
                sleep(.6)
            case 'AllTrainList':
                moveTo(pos_cal(self.middleX, self.trainingMenuY))
                click()
                sleep(1.5)
            case 'ExtendTrain':
                moveTo(pos_cal(self.middleX, self.selecttrainAY))
                click()
                sleep(.5)
            case 'PressExtendedTrain':
                moveTo(pos_cal(self.middleX, self.selecttrainBY))
                click()
                sleep(.5)
            case 'singleplayer':
                moveTo(pos_cal(self.singleplayerX, self.singleplayerY))
                click()
            case 'selectmonster':
                moveTo(pos_cal(self.middleX, self.selectMonstY))
                click()
                sleep(1.5)
            case 'startbattle':
                moveTo(pos_cal(self.middleX, self.startBattleY))
                click()
                sleep(0.5)
            case 'startBtn':
                moveTo(pos_cal(self.okButtonX, self.okButtonAY))
                click_pywinauto(self.okButtonX, self.okButtonAY)
            case 'menuspamclick':
                moveTo(pos_cal(self.okButtonX, self.okButtonBY))
                click_pywinauto(self.okButtonX, self.okButtonBY)

                moveTo(pos_cal(self.okButtonX, self.okButtonCY))
                click_pywinauto(self.okButtonX, self.okButtonCY)

                moveTo(pos_cal(self.okButtonX, self.okButtonEY))
                click_pywinauto(self.okButtonX, self.okButtonEY)
            case 'bottommainmenu':
                moveTo(pos_cal(self.bottommenuX, self.bottommenuY))
                click()
                sleep(.5)
                click()
                sleep(1)
                click()
            case 'shortcut':
                moveTo(pos_cal(self.middleX, self.shortcutY))
                click()
            case 'setshortcut':
                moveTo(pos_cal(self.setshortcutX, self.setshortcutY))
                click()
                sleep(.2)
                moveTo(pos_cal(self.shortcutbtnX, self.shortcutbtnY))
                click()
                sleep(.2)

                moveTo(pos_cal(self.okButtonX, self.okButtonDY))
                click_pywinauto(self.okButtonX, self.okButtonDY)

    def found_image(self, image: str, c=0.8) -> bool:
        '''
        return True if image is found
        :param image: image name
        '''
        _img1 = locateOnScreen(f"resources\{image}_326x566.png", confidence=c)
        _img2 = locateOnScreen(f"resources\{image}_452x782.png", confidence=c)

        if((_img1 is not None) or (_img2 is not None)):
            return True

    def waitandclick(self):
        '''
        There can be a lag before selecting friend's monster.
        This function can run the remaining code once the lag is finished.
        '''
        i = 0
        while 1:
            i += 1
            if self.found_image('card', c=0.95):
                self.clicker('selectmonster')
                self.clicker('startbattle')
                break
            if i > 50:
                print('Something is wrong! The bot will start again.')
                return False

    @staticmethod
    def check_update(local_version: str):
        url = 'https://api.github.com/repos/WanDur/Monster-Strike-Bot/releases/latest'
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            latest_version: str = data['tag_name']
            latest_version = latest_version[1:]
            return latest_version
        else:
            Bot.show_error_box(
                'Cannot check latest version!\nBot will continue with current version.')
            return local_version

    @staticmethod
    def bot_exit():
        sys.exit(0)

    @staticmethod
    def sysio_print(text: str):
        sys.stdout.write(text)

    @staticmethod
    def show_error_box(text: str):
        ctypes.windll.user32.MessageBoxW(0, text, "", 0x10)
