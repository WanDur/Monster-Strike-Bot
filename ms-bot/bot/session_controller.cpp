#include "session_controller.h"
#include <sstream>

namespace bot {

    void SessionController::startSession(SessionState& st) {
        if (st.creating.load()) return;
        st.creating.store(true);

        std::thread([this, &st] {
            try {
                auto created = api_.createSession();
                // store session first, then flip the flag
                st.sessionId = created.sessionId;
                st.writeToken = created.writeToken;
                st.startAt = created.startAt;
                setResult(st, "success: session created (" + st.sessionId + ")");
            }
            catch (const util::HttpError& e) {
                std::ostringstream oss; oss << "failed: create (" << e.status << ") " << e.what();
                setResult(st, oss.str());
            }
            catch (const std::exception& e) {
                setResult(st, std::string("failed: create ") + e.what());
            }
            st.creating.store(false);
            }).detach();
    }

    void SessionController::incrementMatch(SessionState& st) {
        if (st.sessionId.empty() || st.writeToken.empty()) {
            setResult(st, "failed: increment ¡X no session");
            return;
        }
        auto id = st.sessionId; auto tok = st.writeToken;

        std::thread([this, &st, id, tok] {
            try {
                auto r = api_.incrementMatch(id, tok);
                if (r.ok) {
                    setResult(st, "success: totalMatches=" + std::to_string(r.totalMatches));
                }
                else {
                    setResult(st, "failed: increment returned ok=false");
                }
            }
            catch (const util::HttpError& e) {
                std::ostringstream oss; oss << "failed: increment (" << e.status << ") " << e.what();
                setResult(st, oss.str());
            }
            catch (const std::exception& e) {
                setResult(st, std::string("failed: increment ") + e.what());
            }
            }).detach();
    }

    void SessionController::logbox(SessionState& st, const std::string& message, const std::string& type) {
        if (st.sessionId.empty() || st.writeToken.empty()) {
            setResult(st, "failed: logbox ¡X no session");
            return;
        }
        auto id = st.sessionId; auto tok = st.writeToken;

        std::thread([this, &st, id, tok, message, type] {
            try {
                auto r = api_.addLog(id, tok, message, type);
                if (r.ok) {
                    setResult(st, "success: log status=" + r.status);
                }
                else {
                    setResult(st, "failed: logbox returned ok=false");
                }
            }
            catch (const util::HttpError& e) {
                std::ostringstream oss; oss << "failed: logbox (" << e.status << ") " << e.what();
                setResult(st, oss.str());
            }
            catch (const std::exception& e) {
                setResult(st, std::string("failed: logbox ") + e.what());
            }
            }).detach();
    }

} // namespace bot
