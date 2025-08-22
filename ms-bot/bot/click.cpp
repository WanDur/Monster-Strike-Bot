#include "click.h"
#include <algorithm>

namespace bot 
{
    static inline float clampf(float v, float lo, float hi) 
    {
        return (v < lo) ? lo : (v > hi ? hi : v);
    }

    static bool SendLeftClickAtScreen(POINT ptScreen) 
    {
        if (!SetCursorPos(ptScreen.x, ptScreen.y)) return false;
        INPUT inputs[2] = {};
        inputs[0].type = INPUT_MOUSE; inputs[0].mi.dwFlags = MOUSEEVENTF_LEFTDOWN;
        inputs[1].type = INPUT_MOUSE; inputs[1].mi.dwFlags = MOUSEEVENTF_LEFTUP;
        return SendInput(2, inputs, sizeof(INPUT)) == 2;
    }

    static POINT ClientToScreenPt(HWND hwnd, LONG cx, LONG cy) 
    {
        POINT p{ cx, cy }; ClientToScreen(hwnd, &p); return p;
    }

    bool ClickByType(HWND hwndEmulator, MatchType type) 
    {
        if (!IsWindow(hwndEmulator)) return false;

        const RegionTemplate* T = GetTemplate(type);
        if (!T) return false;

        RECT rcClient{};
        if (!GetClientRect(hwndEmulator, &rcClient)) return false;
        const int cw = rcClient.right - rcClient.left;
        const int ch = rcClient.bottom - rcClient.top;
        if (cw <= 0 || ch <= 0) return false;

        float tlx = clampf(T->tl.x, 0.f, 1.f);
        float tly = clampf(T->tl.y, 0.f, 1.f);
        float brx = clampf(T->br.x, 0.f, 1.f);
        float bry = clampf(T->br.y, 0.f, 1.f);
        if (brx < tlx) std::swap(brx, tlx);
        if (bry < tly) std::swap(bry, tly);

        float cxRatio = (tlx + brx) * 0.5f;
        float cyRatio = (tly + bry) * 0.5f;

        LONG cx = static_cast<LONG>(cxRatio * cw + 0.5f);
        LONG cy = static_cast<LONG>(cyRatio * ch + 0.5f);

        POINT ptScreen = ClientToScreenPt(hwndEmulator, cx, cy);
        return SendLeftClickAtScreen(ptScreen);
    }

    bool Click(POINT screenPt) 
    {
        return SendLeftClickAtScreen(screenPt);
    }

}
