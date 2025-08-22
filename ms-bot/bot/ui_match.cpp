#include "ui_match.h"
#include "../util/image_io.h"
#include <vector>
#include <iostream>
#include <algorithm>
#include <cstdint>
#include <cmath>

namespace bot 
{

    static inline int clampi(int v, int lo, int hi) { return (v < lo) ? lo : (v > hi ? hi : v); }
    static inline float clampf(float v, float lo, float hi) { return (v < lo) ? lo : (v > hi ? hi : v); }

    void MatchTemplateRegion(HBITMAP hbm, MatchType type, bool debug) 
    {
        if (!hbm) { std::cout << "cropped: invalid bitmap, mean: 0,0,0\n"; return; }

        const RegionTemplate* T = GetTemplate(type);
        if (!T) { std::cout << "cropped: unknown template, mean: 0,0,0\n"; return; }

        BITMAP bm{};
        if (!GetObject(hbm, sizeof(bm), &bm) || bm.bmWidth <= 0 || bm.bmHeight <= 0) {
            std::cout << "cropped: invalid bitmap size, mean: 0,0,0\n"; return;
        }
        const int W = bm.bmWidth, H = bm.bmHeight;

        RatioPoint tl = T->tl, br = T->br;
        tl.x = clampf(tl.x, 0.f, 1.f); tl.y = clampf(tl.y, 0.f, 1.f);
        br.x = clampf(br.x, 0.f, 1.f); br.y = clampf(br.y, 0.f, 1.f);
        if (br.x < tl.x) std::swap(br.x, tl.x);
        if (br.y < tl.y) std::swap(br.y, tl.y);

        int x1 = static_cast<int>(tl.x * W + 0.5f);
        int y1 = static_cast<int>(tl.y * H + 0.5f);
        int x2 = static_cast<int>(br.x * W + 0.5f);
        int y2 = static_cast<int>(br.y * H + 0.5f);

        x1 = clampi(x1, 0, W - 1); y1 = clampi(y1, 0, H - 1);
        x2 = clampi(x2, 0, W);   y2 = clampi(y2, 0, H);
        if (x2 <= x1) x2 = (std::min)(W, x1 + 1);
        if (y2 <= y1) y2 = (std::min)(H, y1 + 1);
        const int CW = x2 - x1, CH = y2 - y1;

        BITMAPINFO bi{};
        bi.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
        bi.bmiHeader.biWidth = W;
        bi.bmiHeader.biHeight = -H;
        bi.bmiHeader.biPlanes = 1;
        bi.bmiHeader.biBitCount = 32;
        bi.bmiHeader.biCompression = BI_RGB;
        bi.bmiHeader.biSizeImage = W * H * 4;

        std::vector<uint8_t> pixels(W * H * 4);
        HDC hdc = GetDC(nullptr);
        int lines = GetDIBits(hdc, hbm, 0, H, pixels.data(), &bi, DIB_RGB_COLORS);
        ReleaseDC(nullptr, hdc);
        if (lines == 0) { std::cout << "cropped: GetDIBits failed, mean: 0,0,0\n"; return; }

        uint64_t sumR = 0, sumG = 0, sumB = 0, count = 0;
        const size_t stride = static_cast<size_t>(W) * 4;
        for (int y = y1; y < y2; ++y) {
            const uint8_t* row = pixels.data() + static_cast<size_t>(y) * stride;
            for (int x = x1; x < x2; ++x) {
                const uint8_t* px = row + static_cast<size_t>(x) * 4;
                sumB += px[0]; sumG += px[1]; sumR += px[2];
                ++count;
            }
        }
        int meanR = 0, meanG = 0, meanB = 0;
        if (count) { meanR = int(sumR / count); meanG = int(sumG / count); meanB = int(sumB / count); }

        bool hasTarget = (T->tolerance > 0);
        bool match = !hasTarget ||
            (std::abs(meanR - int(T->targetR)) <= T->tolerance &&
                std::abs(meanG - int(T->targetG)) <= T->tolerance &&
                std::abs(meanB - int(T->targetB)) <= T->tolerance);

        std::cout << "cropped: " << x1 << "x" << y1 << ", "
            << x2 << "x" << y2 << ", mean: "
            << meanR << "," << meanG << "," << meanB;
        if (hasTarget) {
            std::cout << ", target: "
                << int(T->targetR) << "," << int(T->targetG) << "," << int(T->targetB)
                << " tol=" << T->tolerance
                << " -> " << (match ? "MATCH" : "NO");
        }
        std::cout << "\n";

        if (debug) {
            HDC sdc = GetDC(nullptr);
            BITMAPINFO cropBI{};
            cropBI.bmiHeader.biSize = sizeof(BITMAPINFOHEADER);
            cropBI.bmiHeader.biWidth = CW;
            cropBI.bmiHeader.biHeight = -CH;
            cropBI.bmiHeader.biPlanes = 1;
            cropBI.bmiHeader.biBitCount = 32;
            cropBI.bmiHeader.biCompression = BI_RGB;

            void* pBits = nullptr;
            HBITMAP crop = CreateDIBSection(sdc, &cropBI, DIB_RGB_COLORS, &pBits, nullptr, 0);
            if (crop && pBits) {
                uint8_t* dst = static_cast<uint8_t*>(pBits);
                for (int y = 0; y < CH; ++y) {
                    const uint8_t* srcRow = pixels.data() + static_cast<size_t>(y1 + y) * stride;
                    const uint8_t* src = srcRow + static_cast<size_t>(x1) * 4;
                    std::memcpy(dst + static_cast<size_t>(y) * CW * 4, src, static_cast<size_t>(CW) * 4);
                }
                util::SaveHBITMAPAsBMP(crop, util::UniqueBmpPath());
                DeleteObject(crop);
            }
            ReleaseDC(nullptr, sdc);
        }
    }

} 
