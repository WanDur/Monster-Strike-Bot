from random import randint
from pyautogui import moveTo, dragTo, click, locateOnScreen
from win32gui import GetWindowRect, EnumWindows, GetWindowText
from time import sleep
import pywinauto


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
        self.dx = window_stat[0]
        self.dy = window_stat[1]
        self.width = window_stat[2]
        self.height = window_stat[3]

        # menu ratio
        self.mainmenuY     = 0.79737
        self.threesubmenuX = 0.23659
        self.mainmenuX     = 0.45957
        self.threesubmenuY = 0.63054
        self.trainingMenuX = 0.45702
        self.trainingMenuY = 0.46673
        self.selecttrainAX = 0.45702
        self.selecttrainAY = 0.35334
        self.selecttrainBX = 0.45702
        self.selecttrainBY = 0.46972
        self.singleplayerX = 0.24165
        self.singleplayerY = 0.52870
        self.selectMonstX  = 0.45702
        self.selectMonstY  = 0.77319
        self.startBattleX  = 0.45606
        self.startBattleY  = 0.69206
        self.okButtonAX    = 0.44864
        self.okButtonAY    = 0.65455
        self.okButtonBX    = 0.44864
        self.okButtonBY    = 0.83179
        self.okButtonCX    = 0.44918
        self.okButtonCY    = 0.60866
        self.bottommenuX   = 0.07945
        self.bottommenuY   = 0.94682
        self.shortcutX     = 0.45652
        self.shortcutY     = 0.74742

        # shoot reference position
        self.middle = (self.dx + self.width * 0.47384, self.dy + self.height * 0.50636)
        self.a1 = (self.dx + self.width * 0.37209, self.dy + self.height * 0.24335)
        self.a2 = (self.dx + self.width * 0.32267, self.dy + self.height * 0.41907)
        self.a3 = (self.dx + self.width * 0.66957, self.dy + self.height * 0.41907)
        self.a4 = (self.dx + self.width * 0.77519, self.dy + self.height * 0.45260)
        self.a5 = (self.dx + self.width * 0.07946, self.dy + self.height * 0.56878)
        self.a6 = (self.dx + self.width * 0.30233, self.dy + self.height * 0.62254)
        self.a7 = (self.dx + self.width * 0.66957, self.dy + self.height * 0.62254)

        self.posList = [self.a1, self.a2, self.a3, self.a4, self.a5, self.a6, self.a7]

    def shoot(self):
        '''
        shoot randomly

        every shoot last for 2.2 seconds
        '''
        finalPos = self.posList[randint(0, len(self.posList) - 1)]
        moveTo(self.middle)
        sleep(.2)
        dragTo(finalPos, duration=0.15)

        sleep(1.85)

    def clicker(self, option: str):
        '''
        perform click action on the game screen
        '''
        def pos_cal(x: float, y: float):
            return (self.dx + self.width * x, self.dy + self.height * y)

        match option:
            case 'mainmenu':
                moveTo(pos_cal(self.mainmenuX, self.mainmenuY))
                click()
                sleep(1)
            case 'threesubmenu':
                moveTo(pos_cal(self.threesubmenuX, self.threesubmenuY))
                click()
                sleep(.6)
            case 'trainingmenu':
                moveTo(pos_cal(self.trainingMenuX, self.trainingMenuY))
                click()
                sleep(2)
            case 'selectbigtrain':
                moveTo(pos_cal(self.selecttrainAX, self.selecttrainAY))
                click()
                sleep(.5)
            case 'selectsmalltrain':
                moveTo(pos_cal(self.selecttrainBX, self.selecttrainBY))
                click()
                sleep(.5)
            case 'singleplayer':
                moveTo(pos_cal(self.singleplayerX, self.singleplayerY))
                click()
                sleep(5)
            case 'selectmonster':
                moveTo(pos_cal(self.selectMonstX, self.selectMonstY))
                click()
                sleep(1)
            case 'startbattle':
                moveTo(pos_cal(self.startBattleX, self.startBattleY))
                click()
                sleep(1)
            case 'startBtn':
                moveTo(pos_cal(self.okButtonAX, self.okButtonAY))
                pywinauto.mouse.press(button='left', coords=(int(
                    self.dx + self.width * self.okButtonAX), int(self.dy + self.height * self.okButtonAY)))
                pywinauto.mouse.release(button='left', coords=(int(
                    self.dx + self.width * self.okButtonAX), int(self.dy + self.height * self.okButtonAY)))
            case 'menuspamclick':
                moveTo(pos_cal(self.okButtonBX, self.okButtonBY))
                pywinauto.mouse.press(button='left', coords=(int(
                    self.dx + self.width * self.okButtonBX), int(self.dy + self.height * self.okButtonBY)))
                pywinauto.mouse.release(button='left', coords=(int(
                    self.dx + self.width * self.okButtonBX), int(self.dy + self.height * self.okButtonBY)))

                moveTo(pos_cal(self.okButtonCX, self.okButtonCY))
                pywinauto.mouse.press(button='left', coords=(int(
                    self.dx + self.width * self.okButtonCX), int(self.dy + self.height * self.okButtonCY)))
                pywinauto.mouse.release(button='left', coords=(int(
                    self.dx + self.width * self.okButtonCX), int(self.dy + self.height * self.okButtonCY)))
            case 'bottommainmenu':
                moveTo(pos_cal(self.bottommenuX, self.bottommenuY))
                click()
            case 'shortcut':
                moveTo(pos_cal(self.shortcutX, self.shortcutY))
                click()
                sleep(3.5)

    def found_image(self, image: str) -> bool:
        '''
        return True if image is found
        :param image: image name, 'level' or 'ok'
        '''
        _img1 = locateOnScreen(f"img\{image}_326x566.png", confidence=0.8)
        _img2 = locateOnScreen(f"img\{image}_452x782.png", confidence=0.8)
        _img3 = locateOnScreen(f"img\{image}_550x948.png", confidence=0.8)

        if((_img1 is not None) or (_img2 is not None) or (_img3 is not None)):
            return True