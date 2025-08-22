#include "capture.h"
#include "image_io.h"
#include <windows.h>

namespace util 
{

    HBITMAP CaptureEmulatorRegion(const RECT& emulatorRect, bool debug) 
    {
        int w = emulatorRect.right - emulatorRect.left;
        int h = emulatorRect.bottom - emulatorRect.top;
        if (w <= 0 || h <= 0) return nullptr;

        HDC hdcScreen = GetDC(nullptr);
        if (!hdcScreen) return nullptr;

        HDC hdcMem = CreateCompatibleDC(hdcScreen);
        if (!hdcMem) { ReleaseDC(nullptr, hdcScreen); return nullptr; }

        BITMAPINFO bi{};
        bi.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
        bi.bmiHeader.biWidth = w;
        bi.bmiHeader.biHeight = -h; // top-down
        bi.bmiHeader.biPlanes = 1;
        bi.bmiHeader.biBitCount = 32;
        bi.bmiHeader.biCompression = BI_RGB;

        void* pBits = nullptr;
        HBITMAP hbm = CreateDIBSection(hdcScreen, &bi, DIB_RGB_COLORS, &pBits, nullptr, 0);
        if (!hbm) {
            DeleteDC(hdcMem);
            ReleaseDC(nullptr, hdcScreen);
            return nullptr;
        }

        HGDIOBJ old = SelectObject(hdcMem, hbm);
        BitBlt(hdcMem, 0, 0, w, h, hdcScreen, emulatorRect.left, emulatorRect.top, SRCCOPY);
        SelectObject(hdcMem, old);
        DeleteDC(hdcMem);
        ReleaseDC(nullptr, hdcScreen);

        if (debug) util::SaveHBITMAPAsBMP(hbm, util::UniqueBmpPath());
        return hbm;
    }

} 
