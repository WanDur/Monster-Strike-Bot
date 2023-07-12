#pragma once
#include <windows.h>

#include <plog/Log.h>

#include "BotChecks.h"
#include "utils.h"

class Bot {
private:
    int dx, dy, width, height;

    Point middle, a1, a2, a3, a4, a5, a6, a7;
    Point posList[10];

#pragma region All ratios
    double middleX        = 0.4570;
    double mainmenuY      = 0.7974;
    double threesubmenuX  = 0.2366;
    double threesubmenuY  = 0.6305;
    double trainingMenuY  = 0.4667;
    double selecttrainAY  = 0.3533;
    double selecttrainBY  = 0.4697;
    double singleplayerX  = 0.2417;
    double singleplayerY  = 0.5287;
    double selectMonstY   = 0.7732;
    double startBattleY   = 0.6921;
    double okButtonX      = 0.4486;
    double okButtonAY     = 0.6546;
    double okButtonBY     = 0.8318;
    double okButtonCY     = 0.6087;
    double okButtonDY     = 0.8065;
    double okButtonEY     = 0.9371;
    double bottommenuX    = 0.0795;
    double bottommenuY    = 0.9468;
    double shortcutY      = 0.7474;
    double setshortcutX   = 0.4447;
    double setshortcutY   = 0.7000;
    double shortcutbtnX   = 0.1233;
    double shortcutbtnY   = 0.5645;
    double maximizeX      = 0.7652;
    double maximizeY      = 0.0221;
#pragma endregion All ratios

public:
    std::string UID;
    const std::string MS_INFO = "< INFO >";
    const std::string MS_WARNING = "< WARNING >";
    const std::string MS_ERROR = "< ERROR >";
    enum ClickOption {
        MainMenu, ThreeSubMenu, AllTrainList, ExtendTrain, PressExtendedTrain, SinglePlayer, SelectMonster,
        StartBattle, StartBtn, MenuSpamClick, okBtnD, BottomMainMenu, ShortCut, SetShortCut, MaximizeWindow, FullSpamClick
    };

    Bot();
    void shoot();
    void clicker(ClickOption option);
    void full_menu_control(int& counter);
    void skipped_menu_control(int& counter);
    bool waitandclick(int& counter);
    Point pos_cal(double x, double y);
    int relPos_cal(double x, bool isWidth);
};