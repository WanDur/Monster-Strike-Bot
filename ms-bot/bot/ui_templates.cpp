#include "ui_templates.h"
#include <unordered_map>

namespace bot 
{

    static const std::unordered_map<MatchType, RegionTemplate> kTemplates =
    {
        { MatchType::MAIN_MENU, RegionTemplate{
            "MAIN_MENU",
            /*tl*/ { 0.058594f, 0.68614f },
            /*br*/ { 0.14648f,  0.72623f },
            /*RGB*/ 62, 99, 162,
            /*tol*/ 5
        } },
        // add more here
    };

    const RegionTemplate* GetTemplate(MatchType type)
    {
        auto it = kTemplates.find(type);
        return (it == kTemplates.end()) ? nullptr : &it->second;
    }

}
