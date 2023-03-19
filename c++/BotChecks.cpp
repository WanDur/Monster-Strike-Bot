#include "BotChecks.h"

BOOL CALLBACK EnumWindowsProc(HWND hwnd, LPARAM lParam)
{
    char window_title[256];
    GetWindowTextA(hwnd, window_title, 256);

    if (strcmp(window_title, emulatorNameCHAR) == 0)
    {
        RECT window_rect;
        GetWindowRect(hwnd, &window_rect);

        int* window_data = reinterpret_cast<int*>(lParam);
        window_data[0] = window_rect.left;
        window_data[1] = window_rect.top;
        window_data[2] = window_rect.right - window_rect.left;
        window_data[3] = window_rect.bottom - window_rect.top;

        return FALSE;
    }

    return TRUE;
}

double getLatestVersion()
{
    using json = nlohmann::json;

    std::string output = GET("https://api.github.com/repos/WanDur/Monster-Strike-Bot/releases/latest");

    json j = json::parse(output);

    std::string tag_name = j["tag_name"];
    tag_name = tag_name.substr(1);

    return std::stod(tag_name);
}

bool isVersionMatch(double currVersion)
{
    double latest_version = getLatestVersion();
    if (currVersion >= latest_version)
    {
        PLOG_INFO.printf("Bot ----- v%.1f", currVersion);
        std::cout << "\n";
        return true;
    }
    else
    {
        PLOG_ERROR.printf("Bot version not match, v%.1f is available", latest_version);
        return false;
    }
}

bool isResolutionSupported()
{
    int my_width = GetSystemMetrics(SM_CXSCREEN);
    int my_height = GetSystemMetrics(SM_CYSCREEN);

    for (int i = 0; i < kSupportedSize; i++)
    {
        if (my_width != kSupportedWidth[i] || my_height != kSupportedHeight[i])
        {
            PLOG_ERROR.printf("Your screen resolution is not supported");
            return false;
        }
    }

    return true;
}
