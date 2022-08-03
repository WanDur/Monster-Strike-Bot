from random import randint
from pyautogui import moveTo, dragTo, click, mouseDown, mouseUp, locateOnScreen
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
    if GetWindowText(hwnd) == '夜神模擬器':  
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
        self.mainmenuX     = 0.459574
        self.mainmenuY     = 0.797379
        self.threesubmenuX = 0.236595
        self.threesubmenuY = 0.630544
        self.trainingMenuX = 0.457021
        self.trainingMenuY = 0.466734
        self.selecttrainAX = 0.457021
        self.selecttrainAY = 0.353340
        self.selecttrainBX = 0.457021
        self.selecttrainBY = 0.469728
        self.singleplayerX = 0.241652
        self.singleplayerY = 0.528705
        self.selectMonstX  = 0.457021
        self.selectMonstY  = 0.63100
        self.startBattleX  = 0.456063
        self.startBattleY  = 0.692067
        self.okButtonAX    = 0.448643
        self.okButtonAY    = 0.645664
        self.okButtonBX    = 0.448643
        self.okButtonBY    = 0.831792
        self.bottommenuX   = 0.079457
        self.bottommenuY   = 0.946821

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
            case 'bottommainmenu':
                moveTo(pos_cal(self.bottommenuX, self.bottommenuY))
                click()

    def longPress(self, option: str):
        '''
        perform press action on the game screen
        '''

        def pos_cal(x: float, y: float):
            return (self.dx + self.width * x, self.dy + self.height * y)

        match option:
            case 'mainmenu':
                mouseDown(pos_cal(self.mainmenuX, self.mainmenuY))
                sleep(3)
                mouseUp()

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