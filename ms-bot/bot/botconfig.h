#pragma once
#include <string>
#include <filesystem>

namespace bot
{
    struct Config
    {
        /* UTF-8 window title of the Android-emulator instance the bot should attach to.
           An empty string means ¡§try the default list¡¨ (see emulator_control.cpp). */
        std::string emulatorName;

        /* Optional path where the JSON/INI file lives.
           Defaults to the same directory where the .exe lives */
        std::filesystem::path storagePath{};

        /* Load settings from disk. */
        [[nodiscard]] bool load();

        /* Save current settings to disk. Create the file if it doesn't exist. */
        void save() const;
    };
} 

