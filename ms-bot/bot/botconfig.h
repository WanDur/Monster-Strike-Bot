#pragma once
#include <string>
#include <filesystem>

namespace bot
{
    /** User-modifiable settings that need to persist between sessions. */
    struct Config
    {
        /** UTF-8 window title of the Android-emulator instance the bot should attach to.
            An empty string means ¡§try the default list¡¨ (see emulator_control.cpp). */
        std::string emulatorName;

        /** Optional path where the JSON/INI file lives.
            If left empty, the implementation chooses a sensible default such as
            %APPDATA%/YourApp/bot_config.json                           */
        std::filesystem::path storagePath{};

        /* ------------ persistence API (implementation in bot_config.cpp) -------- */

        /** Load settings from disk.
            @return true on success; false if the file was missing or malformed. */
        [[nodiscard]] bool load();

        /** Save current settings to disk.
            Creates the directory if it doesn¡¦t exist. */
        void save() const;
    };
} 

