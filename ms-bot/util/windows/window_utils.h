#pragma once
#include <vector>
#include <string>
#include <string_view>

struct HWND__;
using HWND = HWND__*;

namespace windows
{
    std::vector<std::string> enumerateAltTabWindows();

    bool isWindowOpen(std::wstring_view title);

    HWND ensureWindowVisible(std::wstring_view title);
}

