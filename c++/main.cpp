#include "main.h"
#include "Bot.h"

constexpr double VERSION = 3.0;

Point emptyPoint{ 0,0 };

void checkFailSafe(int failSafeDistance, const Bot& rMSBot)
{
    POINT cursorPos;
    int screenWidth = GetSystemMetrics(SM_CXSCREEN);
    int screenHeight = GetSystemMetrics(SM_CYSCREEN);
    
    while (1)
    {
        GetCursorPos(&cursorPos);
        if (cursorPos.x < failSafeDistance || cursorPos.x > screenWidth - failSafeDistance
            || cursorPos.y < failSafeDistance || cursorPos.y > screenHeight - failSafeDistance)
        {
            PLOG_WARNING << "Fail-Safe triggered from mouse moving to a corner of the screen"; 
            POST(0, log_info(rMSBot.MS_WARNING, "Fail-Safe triggered, bot stopped", 0), rMSBot.UID);
            exit(0);
        }
        Sleep(500);
    }
}

int main()
{
    std::ofstream logfile("msbot.log", std::ios::trunc);
    logfile.close();

    plog::init<plog::MyFormatter>(plog::debug, "msbot.log");
    plog::ColorConsoleAppender<plog::MyAppender> consoleAppender; 
    plog::get()->addAppender(&consoleAppender);

    PLOG_INFO.printf("Checking your environment");

    if (!isResolutionSupported())
    {
        show_error_box(L"Your screen resolution is not supported!");
        exit(0);
    }

    if (!isVersionMatch(VERSION))
    {
        show_error_box(L"New version available!");
        exit(0);
    }

    adjustWindowSize(379, 634);
    Sleep(500);

    if (!foundImage("level", emptyPoint))
    {
        system("cls");
        PLOG_ERROR.printf("The game is not on the screen");
        show_error_box(L"The game is not on the screen");
        exit(0);
    }

    PLOG_INFO.printf("Done checking");
    PLOG_INFO.printf("Bot starts after 2 seconds");
    
    Bot ms_bot;
    int counter = 0;
    Sleep(2000);
    system("cls");

    int start = GetTimeNow();

    PLOG_INFO.printf("Your UID: %s\nCheck the bot on https://msbot.pythonanywhere.com\n", ms_bot.UID);
    POST(counter, log_info(ms_bot.MS_INFO, "", counter), ms_bot.UID, true);

    std::thread failSafeThread(checkFailSafe, 3, ms_bot);
    failSafeThread.detach();

    while (1)
    {
        int everyStart = GetTimeNow();
        counter++;
        bool inBattle = false, inResultPage = false;

        if (counter > 1)
        {
            ms_bot.skipped_menu_control(counter);
            bool iserror = ms_bot.waitandclick(counter);
            if (iserror == false)
            {
                counter--;
                Sleep(3000);
                ms_bot.clicker(Bot::BottomMainMenu);
                continue;
            }
        }
        else
        {
            ms_bot.full_menu_control(counter);
            bool iserror = ms_bot.waitandclick(counter);
            if (iserror == false)
            {
                counter--;
                Sleep(3000);
                ms_bot.clicker(Bot::BottomMainMenu);
                continue;
            }
        }

        PLOG_INFO.printf("Battle %d: started", counter);
        POST(counter, log_info(ms_bot.MS_INFO, "Started", counter), ms_bot.UID);

        inBattle = true;
        auto startTime = std::chrono::steady_clock::now();
        auto endTime = startTime + std::chrono::seconds(90);
        while (inBattle)
        {
            ms_bot.shoot();

            if (std::chrono::steady_clock::now() >= endTime)
            {
                if (foundImage("ok", emptyPoint))
                {
                    inBattle = false;
                    inResultPage = true;
                    ms_bot.clicker(Bot::StartBtn);
                }
            }
        }

        PLOG_INFO.printf("Battle %d: in result page", counter);
        POST(counter, log_info(ms_bot.MS_INFO, "In result page", counter), ms_bot.UID);

        while (inResultPage)
        {
            ms_bot.clicker(Bot::MenuSpamClick);
            Sleep(500);
            if (foundImage("level", emptyPoint))
            {
                PLOG_INFO.printf("Battle %d: ended", counter);
                POST(counter, log_info(ms_bot.MS_INFO, "Ended", counter), ms_bot.UID);

                Sleep(2000);
                inResultPage = false;
                system("cls");

                int end = GetTimeNow();
                ms_bot.clicker(Bot::BottomMainMenu);

                PLOG_INFO.printf("Played: %d", counter);
                PLOG_INFO.printf("Total time: %s", convertTimeToString(end - start));
                PLOG_INFO.printf("Average: %s", convertTimeToString(static_cast<int>(round((end - start) / counter)), false));

                POST(counter, log_info(ms_bot.MS_INFO, convertTimeToString(end - everyStart, false), counter), ms_bot.UID);
            }
        }
    }

    return 0;
}

