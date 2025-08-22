#pragma once
#include <cstdint>

namespace bot
{

    struct RatioPoint { float x; float y; };

    enum class MatchType 
    {
        MAIN_MENU,
        // add more types...
    };

    struct RegionTemplate 
    {
        const char* name;
        RatioPoint  tl;
        RatioPoint  br;
        uint8_t     targetR = 0, targetG = 0, targetB = 0;
        int         tolerance = 0;
    };

    // Central registry of UI templates.
    // Declare getter so only this header is included elsewhere.
    const RegionTemplate* GetTemplate(MatchType type);

} 
