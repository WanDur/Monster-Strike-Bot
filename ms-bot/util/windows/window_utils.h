#pragma once
#include <vector>
#include <string>
#include <string_view>
#include <windows.h>

struct HWND__;
using HWND = HWND__*;

namespace util::win
{
    std::vector<std::string> enumerateAltTabWindows();

    bool isWindowOpen(std::wstring_view title);

    HWND ensureWindowVisible(std::wstring_view title);

    // image-io related
    std::wstring ExeDir();

    std::wstring UniqueBmpPath();                 // capture_YYYYMMDD_HHMMSS_mmm.bmp

    bool SaveHBITMAPAsBMP(HBITMAP hbm, const std::wstring& path);
}

