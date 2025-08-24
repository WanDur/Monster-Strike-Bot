#include "emulator_control.h"
#include "botconfig.h"
#include "../util/encoding.h"
#include "../util/windows/window_utils.h"
#include <array>
#include <optional>
#include <string>

namespace bot
{
    bool isEmulatorOpened(bot::Config& cfg)
    {
        constexpr std::array<std::wstring_view, 4> kDefaults = {
            L"BlueStacks", L"NoxPlayer", L"夜神模拟器", L"夜神模擬器"
        };

        /* If we already know the title, just test it */
        if (!cfg.emulatorName.empty())
            return util::win::isWindowOpen(util::encoding::utf8ToWide(cfg.emulatorName));

        /* 2. Otherwise use the default list */
        for (const auto& title : kDefaults)
        {
            if (util::win::isWindowOpen(title))
            {
                cfg.emulatorName = util::encoding::wideToUtf8(std::wstring{ title });
                cfg.save();
                return true;
            }
        }
        return false;
    }
}
