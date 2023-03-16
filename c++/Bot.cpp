#include "Bot.h"

void Bot::shoot()
{
    Point finalPos = posList[randint(0, 6)];
    moveTo(middle);
    Sleep(200);
    dragTo(finalPos, 100);

    Sleep(1200);
}

void Bot::clicker(ClickOption option)
{
    switch (option)
    {
    case MainMenu:
        moveTo(pos_cal(middleX, mainmenuY));
        doubleclick();
        Sleep(1000);
        break;
    case ThreeSubMenu:
        moveTo(pos_cal(threesubmenuX, threesubmenuY));
        click();
        Sleep(600);
        break;
    case AllTrainList:
        moveTo(pos_cal(middleX, trainingMenuY));
        click();
        Sleep(1500);
        break;
    case ExtendTrain:
        moveTo(pos_cal(middleX, selecttrainAY));
        click();
        Sleep(500);
        break;
    case PressExtendedTrain:
        moveTo(pos_cal(middleX, selecttrainBY));
        click();
        Sleep(500);
        break;
    case SinglePlayer:
        moveTo(pos_cal(singleplayerX, singleplayerY));
        click();
        break;
    case SelectMonster:
        moveTo(pos_cal(middleX, selectMonstY));
        click();
        Sleep(1500);
        break;
    case StartBattle:
        moveTo(pos_cal(middleX, startBattleY));
        click();
        Sleep(500);
        break;
    case StartBtn:
        moveTo(pos_cal(okButtonX, okButtonAY));
        click();
        Sleep(500);
        break;
    case MenuSpamClick:
        moveTo(pos_cal(okButtonX, okButtonBY));
        click();
        Sleep(300);

        moveTo(pos_cal(okButtonX, okButtonCY));
        click();
        Sleep(300);

        moveTo(pos_cal(okButtonX, okButtonEY));
        click();
        Sleep(300);
        break;
    case BottomMainMenu:
        moveTo(pos_cal(bottommenuX, bottommenuY));
        click();
        Sleep(500);
        click();
        Sleep(1000);
        click();
        break;
    case ShortCut:
        moveTo(pos_cal(middleX, shortcutY));
        click();
        break;
    case SetShortCut:
        moveTo(pos_cal(setshortcutX, setshortcutY));
        click();
        Sleep(200);
        moveTo(pos_cal(shortcutbtnX, shortcutbtnY));
        click();
        Sleep(200);

        moveTo(pos_cal(okButtonX, okButtonDY));
        click();
        break;
    case MaximizeWindow:
        moveTo(pos_cal(maximizeX, maximizeY));
        click();
        moveTo(Point{ 1000, 500 });
        break;
    }
}

void Bot::full_menu_control(int& counter)
{
    clicker(MainMenu);
    clicker(ThreeSubMenu);
    clicker(AllTrainList);
    clicker(ExtendTrain);
    clicker(PressExtendedTrain);
    clicker(SinglePlayer);
}

void Bot::skipped_menu_control(int& counter)
{
    Sleep(500);
    clicker(SetShortCut);
    clicker(ShortCut);
}

bool Bot::waitandclick(int& counter) 
{
    int i = 0;
    while (1)
    {
        i++;
        Point p{ 0,0 };

        if (foundImage("card", p, 0.95))
        {
            clicker(SelectMonster);
            clicker(StartBattle);
            return true;
        }
        if (i > 40)
        {
            PLOG_WARNING.printf("Something is wrong, restarting the bot");
            POST(counter, log_info(MS_WARNING, "Restarting bot due to error", counter), UID);
            return false;
        }
    }
}

Bot::Bot()
{
    int window_data[4] = { 0 }, x, y, w, h;
    EnumWindows(EnumWindowsProc, reinterpret_cast<LPARAM>(window_data));

    if (window_data[0] != 0)
    {
        x = window_data[0];
        y = window_data[1];
        w = window_data[2];
        h = window_data[3];
    }
    else
    {
        PLOG_ERROR.printf("Emulator not found");
        show_error_box(L"Emulator not found.");
        exit(0);
    }

    dx = x;
    dy = y;
    width = w;
    height = h;

    middle = { static_cast<int>(dx + width * 0.47384), static_cast<int>(dy + height * 0.50636) };

    double shootPosRatio[7][2] =
    {
        {0.3721, 0.2434},
        {0.3227, 0.4191},
        {0.6696, 0.4191},
        {0.7752, 0.4526},
        {0.0795, 0.5688},
        {0.3023, 0.6225},
        {0.6696, 0.6225}
    };

    for (int i = 0; i < 7; i++) 
    {
        posList[i] = { static_cast<int>(dx + width * shootPosRatio[i][0]), static_cast<int>(dy + height * shootPosRatio[i][1]) };
    }

    UID = generate_uid();
}

Point Bot::pos_cal(double x, double y)
{
    return Point{ static_cast<int>(dx + width * x), static_cast<int>(dy + height * y) };
}
