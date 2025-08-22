#include "window_utils.h"
#include "../util/encoding.h"
#include <Windows.h>
#include <algorithm>
#include <array>
#include <string>
#include <string_view>
#include <vector>

namespace
{
    constexpr std::array<std::string_view, 10> ignored {
        "chrome", "discord", "file", "ms-bot", "netflix",
        "spotify", "steam", "settings", "vpn", "windows"
    };

    std::string toLower(std::string s)
    {
        std::transform(s.begin(), s.end(), s.begin(), [](unsigned char c) { return static_cast<char>(std::tolower(c)); });
        return s;
    }

    bool shouldIgnore(const std::string_view title)
    {
        const std::string tLower = toLower(std::string{ title });
        return std::any_of(ignored.begin(), ignored.end(),
            [&](std::string_view pat) { return !pat.empty() && tLower.find(pat) != std::string::npos; });
    }

    BOOL CALLBACK altTabEnumProc(HWND hWnd, LPARAM lParam)
    {
        if (!::IsWindowVisible(hWnd))                          return TRUE;
        if (::GetWindow(hWnd, GW_OWNER) != nullptr)            return TRUE;
        if (::GetWindowLongW(hWnd, GWL_EXSTYLE) & WS_EX_TOOLWINDOW)
            return TRUE;

        wchar_t wTitle[512];
        if (::GetWindowTextW(hWnd, wTitle, _countof(wTitle)) == 0) return TRUE;

        const std::string title = util::encoding::wideToUtf8(wTitle);
        if (shouldIgnore(title)) return TRUE;

        auto* vec = reinterpret_cast<std::vector<std::string>*>(lParam);
        vec->push_back(title);
        return TRUE;   // keep enumerating
    }
}

namespace windows
{
    std::vector<std::string> enumerateAltTabWindows()
    {
        std::vector<std::string> titles;
        ::EnumWindows(altTabEnumProc, reinterpret_cast<LPARAM>(&titles));
        return titles;
    }

    bool isWindowOpen(std::wstring_view title)
    {
        return ::FindWindowW(nullptr, std::wstring{ title }.c_str()) != nullptr;
    }

    HWND ensureWindowVisible(std::wstring_view title)
    {
        HWND hwnd = ::FindWindowW(nullptr, std::wstring{ title }.c_str());
        if (!hwnd) return NULL;

        if (::IsIconic(hwnd))
        {
            ::ShowWindow(hwnd, SW_RESTORE);
            ::SetForegroundWindow(hwnd); 
        }
        return hwnd;
    }
}

