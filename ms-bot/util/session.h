#pragma once
#include <string>
#include <nlohmann/json.hpp>
#include "http_client.h"

namespace util {

    struct SessionCreated {
        std::string sessionId;
        int64_t     startAt;
        std::string writeToken;
    };

    struct IncrementResult {
        bool ok = false;
        int  totalMatches = 0;
    };

    struct LogboxResult {
        bool ok = false;
        std::string status; // 'normal' | 'alert' | 'stopped'
    };

    class SessionsApi {
    public:
        explicit SessionsApi(HttpClient& http) : http_(http) {}

        // POST /api/sessions
        SessionCreated createSession();

        // POST /api/sessions/:id/increment_match  (x-write-token)
        IncrementResult incrementMatch(const std::string& id, const std::string& writeToken);

        // POST /api/sessions/:id/logbox (x-write-token, body: {message, type})
        LogboxResult addLog(const std::string& id,
            const std::string& writeToken,
            const std::string& message,
            const std::string& type = "info");

    private:
        HttpClient& http_;
    };

} // namespace util
