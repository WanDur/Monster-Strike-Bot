#include "session.h"

namespace util {
    using json = nlohmann::json;

    SessionCreated SessionsApi::createSession() 
    {
        auto resp = http_.postJson("/sessions", "{}");
        auto j = json::parse(resp.body);

        return SessionCreated
        {
            j.at("session").get<std::string>(),
            j.at("startAt").get<int64_t>(),
            j.at("writeToken").get<std::string>()
        };
    }

    IncrementResult SessionsApi::incrementMatch(const std::string& id, const std::string& writeToken) 
    {
        std::vector<std::string> hdr = { "x-write-token: " + writeToken };
        auto path = "/sessions/" + HttpClient::urlEncode(id) + "/increment_match";
        auto resp = http_.postJson(path, "{}", hdr);
        auto j = json::parse(resp.body);
        return { j.at("ok").get<bool>(), j.at("totalMatches").get<int>() };
    }

    LogboxResult SessionsApi::addLog(const std::string& id,
        const std::string& writeToken,
        const std::string& message,
        const std::string& type) 
    {
        json body;
        body["message"] = message;
        if (!type.empty()) body["type"] = type;

        std::vector<std::string> hdr = { "x-write-token: " + writeToken };
        auto path = "/sessions/" + HttpClient::urlEncode(id) + "/logbox";
        auto resp = http_.postJson(path, body.dump(), hdr);
        auto j = json::parse(resp.body);
        return { j.at("ok").get<bool>(), j.at("status").get<std::string>() };
    }

}
