#pragma once
#include <string>
#include <string_view>

namespace util::encoding
{
    /* Convert Windows wide string to UTF-8 */
    std::string wideToUtf8(std::wstring_view wstr);

    /* Convert UTF-8 to Windows wide string */
    std::wstring utf8ToWide(std::string_view u8str);
} 
