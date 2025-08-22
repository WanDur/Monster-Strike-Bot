#pragma once
#include <string>
#include <optional>
#include <mutex>
#include <atomic>
#include <thread>
#include "../util/http_client.h"
#include "../util/session.h"

namespace bot {

    // Keep this in-memory for the app lifetime.
    // UI will read these fields each frame.
    struct SessionState {
        // Spinner flag for POST /sessions
        std::atomic<bool> creating{ false };

        // Persisted session for subsequent calls
        std::string sessionId;
        std::string writeToken;
        std::string startAt;

        // Result surface for background calls (increment/logbox)
        std::mutex mtx;
        std::optional<std::string> lastResult; // "success: ..." or "failed: ..."
    };

    class SessionController {
    public:
        SessionController(util::HttpClient& http) : api_(http) {}

        // UI thread -> non-blocking
        void startSession(SessionState& st);

        // Fire-and-forget; UI only updates when done (success/failed)
        void incrementMatch(SessionState& st);
        void logbox(SessionState& st, const std::string& message, const std::string& type);

    private:
        util::SessionsApi api_;

        static void setResult(SessionState& st, const std::string& msg) {
            std::lock_guard<std::mutex> lk(st.mtx);
            st.lastResult = msg;
        }
    };

} // namespace bot
