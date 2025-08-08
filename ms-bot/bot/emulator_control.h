#pragma once
#include <string_view>

struct BotConfig;

namespace bot
{
    struct Config;
    /* Detect whether an Android emulator window is running.
       If cfg.emulatorName is empty it tries a hard-coded list of common titles.
       On the first successful match the function updates cfg.emulatorName */
    bool isEmulatorOpened(Config& cfg);
} 
