#include "botconfig.h"
#include "../util/encoding.h"
#include <nlohmann/json.hpp>
#include <Windows.h>            
#include <fstream>
#include <filesystem>

namespace fs = std::filesystem;
using json = nlohmann::json;

namespace
{
    fs::path defaultPath()
    {
        wchar_t buf[MAX_PATH] = { 0 };
        ::GetModuleFileNameW(nullptr, buf, MAX_PATH);
        return fs::path{ buf }.replace_filename(L"bot_config.json");
    }

    void ensureDir(const fs::path& p)
    {
        if (auto dir = p.parent_path(); !dir.empty() && !fs::exists(dir))
            fs::create_directories(dir);
    }
}

bool bot::Config::load()
{
    const fs::path file = storagePath.empty() ? defaultPath() : storagePath;

    std::ifstream in(file, std::ios::binary);
    if (!in) return false;

    json j;
    try { in >> j; }
    catch (const json::parse_error&) { return false; }

    const auto it = j.find("emulatorName");
    if (it != j.end() && it->is_string())
        emulatorName = it->get<std::string>();

    return true;
}

void bot::Config::save() const
{
    const fs::path file = storagePath.empty() ? defaultPath() : storagePath;
    ensureDir(file);

    json j;
    j["emulatorName"] = emulatorName;

    std::ofstream out(file, std::ios::binary | std::ios::trunc);
    if (out) out << j.dump(4);
}
