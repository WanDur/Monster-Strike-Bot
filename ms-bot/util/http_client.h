#pragma once
#include <string>
#include <vector>
#include <stdexcept>
#include <curl/curl.h>

namespace util {

    struct HttpResponse {
        long status = 0;
        std::string body;
        std::vector<std::string> headers;
    };

    class HttpError : public std::runtime_error {
    public:
        long status;
        explicit HttpError(long s, const std::string& msg)
            : std::runtime_error(msg), status(s) {}
    };

    class CurlGlobal {
    public:
        CurlGlobal() { curl_global_init(CURL_GLOBAL_DEFAULT); }
        ~CurlGlobal() { curl_global_cleanup(); }
    };

    // Base URL must include protocol + host (+ optional /api)
    class HttpClient {
    public:
        explicit HttpClient(std::string baseUrl);
        ~HttpClient();

        HttpResponse get(const std::string& path,
            const std::vector<std::string>& headers = {},
            long timeoutMs = 15000);

        HttpResponse postJson(const std::string& path,
            const std::string& jsonBody,
            const std::vector<std::string>& headers = {},
            long timeoutMs = 15000);

        // Handy for :id
        static std::string urlEncode(const std::string& s);

    private:
        std::string baseUrl_;
        static size_t writeBodyCb(char* ptr, size_t size, size_t nmemb, void* userdata);
        static size_t writeHeaderCb(char* buffer, size_t size, size_t nitems, void* userdata);
        static void setCommonOpts(CURL* curl, const std::string& url, long timeoutMs);

        HttpResponse perform(CURL* curl, struct curl_slist* headerList);
    };

} // namespace util
