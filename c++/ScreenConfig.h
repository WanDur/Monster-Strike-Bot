#include <Windows.h>
#include <string>
#include <map>

class ScreenConfig {
public:
    static ScreenConfig& getInstance();

    int screenWidth_;
    int screenHeight_;
    int emulatorWidth_;
    int emulatorHeight_;
    std::string imagePath_;

    bool isResolutionMatch();

private:
    struct ResolutionConfigs {
        int emulatorWidth;
        int emulatorHeight;
        std::string imagePath;
    };

    ScreenConfig();
    ScreenConfig(const ScreenConfig&) = delete;
    ScreenConfig& operator=(const ScreenConfig&) = delete;
    
    std::map<std::pair<int, int>, ResolutionConfigs> resolutionConfigs_;

    bool isSupportedResolution(int width, int height);
};
