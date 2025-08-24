#include <algorithm>
#include <array>
#include <string>
#include <string_view>
#include <vector>

#include "window_utils.h"
#include "../util/encoding.h"

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

namespace util::win
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

    std::wstring ExeDir()
    {
        wchar_t path[MAX_PATH];
        GetModuleFileNameW(nullptr, path, MAX_PATH);
        std::wstring p(path);
        auto pos = p.find_last_of(L"\\/");
        return (pos == std::wstring::npos) ? L"." : p.substr(0, pos);
    }

    std::wstring UniqueBmpPath()
    {
        SYSTEMTIME st; GetLocalTime(&st);
        wchar_t name[256];
        swprintf_s(name, L"capture_%04d%02d%02d_%02d%02d%02d_%03d.bmp",
            st.wYear, st.wMonth, st.wDay, st.wHour, st.wMinute, st.wSecond, st.wMilliseconds);
        return ExeDir() + L"\\" + name;
    }

    bool SaveHBITMAPAsBMP(HBITMAP hbm, const std::wstring& path)
    {
        BITMAP bm{};
        if (!GetObject(hbm, sizeof(bm), &bm)) return false;

        BITMAPINFO bi{};
        bi.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
        bi.bmiHeader.biWidth = bm.bmWidth;
        bi.bmiHeader.biHeight = -bm.bmHeight; // top-down
        bi.bmiHeader.biPlanes = 1;
        bi.bmiHeader.biBitCount = 32;
        bi.bmiHeader.biCompression = BI_RGB;
        bi.bmiHeader.biSizeImage = bm.bmWidth * 4 * bm.bmHeight;

        std::string pixelData(bi.bmiHeader.biSizeImage, 0);

        HDC hdc = GetDC(nullptr);
        int scanLines = GetDIBits(hdc, hbm, 0, bm.bmHeight, pixelData.data(), &bi, DIB_RGB_COLORS);
        ReleaseDC(nullptr, hdc);
        if (scanLines == 0) return false;

        BITMAPFILEHEADER bfh{};
        bfh.bfType = 0x4D42; // 'BM'
        bfh.bfOffBits = sizeof(BITMAPFILEHEADER) + sizeof(BITMAPINFOHEADER);
        bfh.bfSize = bfh.bfOffBits + (DWORD)pixelData.size();

        HANDLE hFile = CreateFileW(path.c_str(), GENERIC_WRITE, 0, nullptr, CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, nullptr);
        if (hFile == INVALID_HANDLE_VALUE) return false;

        DWORD written = 0;
        BOOL ok = WriteFile(hFile, &bfh, sizeof(bfh), &written, nullptr)
            && WriteFile(hFile, &bi.bmiHeader, sizeof(BITMAPINFOHEADER), &written, nullptr)
            && WriteFile(hFile, pixelData.data(), (DWORD)pixelData.size(), &written, nullptr);
        CloseHandle(hFile);
        return ok == TRUE;
    }
}

