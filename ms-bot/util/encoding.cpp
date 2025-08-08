#include "encoding.h"
#define WIN32_LEAN_AND_MEAN
#include <Windows.h>
#include <iostream>

namespace util::encoding
{
    std::string wideToUtf8(std::wstring_view wstr)
    {
        if (wstr.empty()) return {};

        const int needed = ::WideCharToMultiByte(
            CP_UTF8, 0,
            wstr.data(), static_cast<int>(wstr.size()),
            nullptr, 0, nullptr, nullptr);

        if (needed <= 0)
        {
            std::cerr << "WideCharToMultiByte size query failed" << std::endl;
        }

        std::string out(needed, '\0');

        const int written = ::WideCharToMultiByte(
            CP_UTF8, 0,
            wstr.data(), static_cast<int>(wstr.size()),
            out.data(), needed, nullptr, nullptr);

        if (written != needed)
        {
            std::cerr << "WideCharToMultiByte conversion failed" << std::endl;
        }

        return out;
    }

    std::wstring utf8ToWide(std::string_view u8str)
    {
        if (u8str.empty()) return {};

        const int needed = ::MultiByteToWideChar(
            CP_UTF8, 0,
            u8str.data(), static_cast<int>(u8str.size()),
            nullptr, 0);

        if (needed <= 0)
        {
            std::cerr << "MultiByteToWideChar size query failed" << std::endl;
        }

        std::wstring out(needed, L'\0');

        const int written = ::MultiByteToWideChar(
            CP_UTF8, 0,
            u8str.data(), static_cast<int>(u8str.size()),
            out.data(), needed);

        if (written != needed)
        {
            std::cerr << "MultiByteToWideChar conversion failed" << std::endl;
        }

        return out;
    }
}
