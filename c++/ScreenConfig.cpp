#include "ScreenConfig.h"

ScreenConfig& ScreenConfig::getInstance()
{
    static ScreenConfig instance;
    return instance;
}

ScreenConfig::ScreenConfig()
{
    resolutionConfigs_ = 
    {
        {{1920, 1080}, {379, 634, "resources/im.dur"}},
    };

    screenWidth_ = GetSystemMetrics(SM_CXSCREEN);
    screenHeight_ = GetSystemMetrics(SM_CYSCREEN);

    auto config = resolutionConfigs_.find({ screenWidth_, screenHeight_ });
    if (config != resolutionConfigs_.end()) 
    {
        emulatorWidth_ = config->second.emulatorWidth;
        emulatorHeight_ = config->second.emulatorHeight;
        imagePath_ = config->second.imagePath;
    }
}

bool ScreenConfig::isSupportedResolution(int width, int height) 
{
    return resolutionConfigs_.find({ width, height }) != resolutionConfigs_.end();
}

bool ScreenConfig::isResolutionMatch()
{
    return isSupportedResolution(screenWidth_, screenHeight_);
}
