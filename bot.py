import random
import pyautogui
import time
import pywinauto


class Bot:
    def __init__(self, dx: int, dy: int, height: int, width: int):
        '''
        :param dx: x coordinate of the top right corner of the game screen
        :param dy: y coordinate of the top right corner of the game screen

        :param height: height of the game screen
        :param width: width of the game screen
        '''
        # initilize
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

        self.posList = [self.middle, self.bottomLeft,
                        self.bottomRight, self.topLeft, self.topRight]

    def shoot(self):
        '''
        shoot randomly

        every shoot last for 3 seconds
        '''
        _randomPos = random.sample(self.posList, k=2)
        initPos = _randomPos[0]
        finalPos = _randomPos[1]

        pyautogui.moveTo(initPos)
        time.sleep(.5)
        pyautogui.dragTo(finalPos, duration=0.5)

        time.sleep(2)

    def clicker(self, option: str):
        '''
        perform click action on the game screen
        '''
        def pos_cal(x: float, y: float):
            return (self.dx + self.width * x, self.dy + self.height * y)

        match option:
            case 'mainmenu':
                pyautogui.moveTo(pos_cal(self.half, self.mainmenuY))
                pyautogui.click()
                time.sleep(1)
            case 'threesubmenu':
                pyautogui.moveTo(
                    pos_cal(self.threesubmenuX, self.threesubmenuY))
                pyautogui.click()
                time.sleep(.6)
            case 'trainingmenu':
                pyautogui.moveTo(pos_cal(self.half, self.trainingMenuY))
                pyautogui.click()
                time.sleep(2)
            case 'selectbigtrain':
                pyautogui.moveTo(pos_cal(self.half, self.selectBigtrainY))
                pyautogui.click()
                time.sleep(.5)
            case 'selectsmalltrain':
                pyautogui.moveTo(pos_cal(self.half, self.selectSmalltrainY))
                pyautogui.click()
                time.sleep(1)
            case 'singleplayer':
                pyautogui.moveTo(pos_cal(self.singleplayerX, self.half))
                pyautogui.click()
                time.sleep(5)
            case 'selectmonster':
                pyautogui.moveTo(pos_cal(self.half, self.selectMonsterY))
                pyautogui.click()
                time.sleep(1)
            case 'startbattle':
                pyautogui.moveTo(pos_cal(self.half, self.startBattleY))
                pyautogui.click()
                time.sleep(1)
            case 'startBtn':
                pyautogui.moveTo(pos_cal(self.half, self.okButtonY))
                _x = self.dx + self.width * self.half
                _y = self.dy + self.height * self.okButtonY
                pywinauto.mouse.press(button='left', coords=(int(_x), int(_y)))
                pywinauto.mouse.release(
                    button='left', coords=(int(_x), int(_y)))
            case 'menuspamclick':
                pyautogui.moveTo(pos_cal(self.half, self.okButton2Y))
                _x = self.dx + self.width * self.half
                _y = self.dy + self.height * self.okButton2Y
                pywinauto.mouse.press(button='left', coords=(int(_x), int(_y)))
                pywinauto.mouse.release(
                    button='left', coords=(int(_x), int(_y)))
            case 'bottommainmenu':
                pyautogui.moveTo(
                    pos_cal(self.bottommainmenuX, self.bottommainmenuY))
                pyautogui.click()
