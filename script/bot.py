from random import randint
from pyautogui import moveTo, dragTo, click, locateOnScreen
from win32gui import GetWindowRect, EnumWindows, GetWindowText
from time import sleep
import pywinauto
import requests
from bs4 import BeautifulSoup
from re import search

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
        self.okButtonDX    = 0.45013
        self.okButtonDY    = 0.80645
        self.okButtonEX    = 0.44594
        self.okButtonEY    = 0.71197
        self.bottommenuX   = 0.07945
        self.bottommenuY   = 0.94682
        self.shortcutX     = 0.45652
        self.shortcutY     = 0.74742
        self.setshortcutX  = 0.44474
        self.setshortcutY  = 0.70000
        self.shortcutbtnX  = 0.12329
        self.shortcutbtnY  = 0.56452

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

        every shoot last for 1.9 seconds
        '''
        finalPos = self.posList[randint(0, len(self.posList) - 1)]
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
            pywinauto.mouse.press(button='left', coords=(int(self.dx + self.width * x), int(self.dy + self.height * y)))
            pywinauto.mouse.release(button='left', coords=(int(self.dx + self.width * x), int(self.dy + self.height * y)))
            return  

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
                sleep(1.5)
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
            case 'selectmonster':
                moveTo(pos_cal(self.selectMonstX, self.selectMonstY))
                click()
                sleep(1.5)
            case 'startbattle':
                moveTo(pos_cal(self.startBattleX, self.startBattleY))
                click()
                sleep(0.5)
            case 'startBtn':
                moveTo(pos_cal(self.okButtonAX, self.okButtonAY))
                click_pywinauto(self.okButtonAX, self.okButtonAY)
            case 'menuspamclick':
                moveTo(pos_cal(self.okButtonBX, self.okButtonBY))
                click_pywinauto(self.okButtonBX, self.okButtonBY)

                moveTo(pos_cal(self.okButtonCX, self.okButtonCY))
                click_pywinauto(self.okButtonCX, self.okButtonCY)

                moveTo(pos_cal(self.okButtonEX, self.okButtonEY))
                click_pywinauto(self.okButtonEX, self.okButtonEY)
            case 'okBtnD':
                moveTo(pos_cal(self.okButtonDX, self.okButtonDY))
                click_pywinauto(self.okButtonDX, self.okButtonDY)
            case 'bottommainmenu':
                moveTo(pos_cal(self.bottommenuX, self.bottommenuY))
                click()
                sleep(.5)
                click()
                sleep(1)
                click()
            case 'shortcut':
                moveTo(pos_cal(self.shortcutX, self.shortcutY))
                click()
            case 'setshortcut':
                moveTo(pos_cal(self.setshortcutX, self.setshortcutY))
                click()
                sleep(.2)
                moveTo(pos_cal(self.shortcutbtnX, self.shortcutbtnY))
                click()
                sleep(.2)
                self.clicker('okBtnD')

    def found_image(self, image: str, c=0.8) -> bool:
        '''
        return True if image is found
        :param image: image name
        '''
        _img1 = locateOnScreen(f"img\{image}_326x566.png", confidence=c)
        _img2 = locateOnScreen(f"img\{image}_452x782.png", confidence=c)

        if((_img1 is not None) or (_img2 is not None)):
            return True

    
    def waitandclick(self):
        '''
        There can be a lag before selecting friend's monster.
        This function can run the remaining code once the lag is finished.
        '''
        while 1:
            if self.found_image('card', c=0.95):
                self.clicker('selectmonster')
                self.clicker('startbattle')
                break
    
    @staticmethod
    def check_update():
        '''
        check from github to get the latest version
        '''
        url = 'https://github.com/WanDur/Monster-Strike-Bot'
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        md = soup.find('article', class_='markdown-body entry-content container-lg')
        h1 = str(md.find('h1'))
        pos = search('Monster Strike Bot', h1).span()
        v = h1[pos[0]:]
        v = v[20:]
        latest_version = v[:5]

        if latest_version[3] == '<':
            latest_version = latest_version[:3]

        return latest_version
