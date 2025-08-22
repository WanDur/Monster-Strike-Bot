#include "image_io.h"
#include <windows.h>
#include <string>

namespace util 
{
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
