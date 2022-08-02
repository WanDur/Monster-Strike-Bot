import random
from pyautogui import moveTo, dragTo, click, mouseDown, mouseUp, locateOnScreen
from time import sleep
import pywinauto


class Bot:
    def __init__(self, dx: int, dy: int, height: int, width: int):
        '''
        :param dx: x coordinate of the top right corner of the game screen
        :param dy: y coordinate of the top right corner of the game screen

        :param height: height of the game screen
        :param width: width of the game screen
        '''
        # initialize
        self.dx = dx
        self.dy = dy
        self.height = height
        self.width = width

        # menu ratio
        self.half = 0.5
        self.mainmenuY = 0.79741
        self.threesubmenuY = 0.6
        self.threesubmenuX = 0.25
        self.trainingMenuY = 0.43689
        self.selectBigtrainY = 0.31553
        self.selectSmalltrainY = 0.43689
        self.singleplayerX = 0.29167
        self.selectMonsterY = 0.6068
        self.startBattleY = 0.6796
        self.okButtonY = 0.6359
        self.okButton2Y = 0.82125
        self.bottommainmenuY = 0.9468
        self.bottommainmenuX = 0.0875

        # shoot reference position
        self.middle = (self.dx + width / 2, self.dy + height / 2)
        self.bottomLeft = (self.dx + width * 0.1666, self.dy + height * 0.66)
        self.bottomRight = (self.dx + width * 0.92, self.dy + height * 0.4126)
        self.topLeft = (self.dx + width * 0.1666, self.dy + height * 0.1456)
        self.topRight = (self.dx + width * 0.8333, self.dy + height * 0.2)

        self.posList = [self.middle, self.bottomLeft, self.bottomRight, self.topLeft, self.topRight]

    def shoot(self):
        '''
        shoot randomly

        every shoot last for 2.2 seconds
        '''
        _randomPos = random.sample(self.posList, k=2)
        initPos = _randomPos[0]
        finalPos = _randomPos[1]

        moveTo(initPos)
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
                moveTo(pos_cal(self.half, self.mainmenuY))
                click()
                sleep(1)
            case 'threesubmenu':
                moveTo(pos_cal(self.threesubmenuX, self.threesubmenuY))
                click()
                sleep(.6)
            case 'trainingmenu':
                moveTo(pos_cal(self.half, self.trainingMenuY))
                click()
                sleep(2)
            case 'selectbigtrain':
                moveTo(pos_cal(self.half, self.selectBigtrainY))
                click()
                sleep(.5)
            case 'selectsmalltrain':
                moveTo(pos_cal(self.half, self.selectSmalltrainY))
                click()
                sleep(1)
            case 'singleplayer':
                moveTo(pos_cal(self.singleplayerX, self.half))
                click()
                sleep(5)
            case 'selectmonster':
                moveTo(pos_cal(self.half, self.selectMonsterY))
                click()
                sleep(1)
            case 'startbattle':
                moveTo(pos_cal(self.half, self.startBattleY))
                click()
                sleep(1)
            case 'startBtn':
                moveTo(pos_cal(self.half, self.okButtonY))
                _x = self.dx + self.width * self.half
                _y = self.dy + self.height * self.okButtonY
                pywinauto.mouse.press(button='left', coords=(int(_x), int(_y)))
                pywinauto.mouse.release(button='left', coords=(int(_x), int(_y)))
            case 'menuspamclick':
                moveTo(pos_cal(self.half, self.okButton2Y))
                _x = self.dx + self.width * self.half
                _y = self.dy + self.height * self.okButton2Y
                pywinauto.mouse.press(button='left', coords=(int(_x), int(_y)))
                pywinauto.mouse.release(button='left', coords=(int(_x), int(_y)))
            case 'bottommainmenu':
                moveTo(pos_cal(self.bottommainmenuX, self.bottommainmenuY))
                click()

    def longPress(self, option: str):
        '''
        perform press action on the game screen
        '''

        def pos_cal(x: float, y: float):
            return (self.dx + self.width * x, self.dy + self.height * y)

        match option:
            case 'mainmenu':
                mouseDown(pos_cal(self.half, self.mainmenuY))
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
