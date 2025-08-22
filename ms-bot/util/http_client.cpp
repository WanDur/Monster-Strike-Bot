#include "http_client.h"
#include <sstream>

namespace util {

    HttpClient::HttpClient(std::string baseUrl) : baseUrl_(std::move(baseUrl)) {
        if (!baseUrl_.empty() && baseUrl_.back() == '/') baseUrl_.pop_back();
    }
    HttpClient::~HttpClient() = default;

    size_t HttpClient::writeBodyCb(char* ptr, size_t size, size_t nmemb, void* userdata) {
        auto* out = static_cast<std::string*>(userdata);
        out->append(ptr, size * nmemb);
        return size * nmemb;
    }
    size_t HttpClient::writeHeaderCb(char* buffer, size_t size, size_t nitems, void* userdata) {
        size_t total = size * nitems;
        auto* hdrs = static_cast<std::vector<std::string>*>(userdata);
        hdrs->emplace_back(buffer, total);
        return total;
    }
    void HttpClient::setCommonOpts(CURL* curl, const std::string& url, long timeoutMs) {
        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);
        curl_easy_setopt(curl, CURLOPT_TIMEOUT_MS, timeoutMs);
#ifdef _WIN32
        curl_easy_setopt(curl, CURLOPT_SSL_OPTIONS, CURLSSLOPT_NATIVE_CA);
#endif
    }

    HttpResponse HttpClient::perform(CURL* curl, struct curl_slist* headerList) {
        HttpResponse resp;
        std::string body;
        std::vector<std::string> headers;

        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, &HttpClient::writeBodyCb);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &body);
        curl_easy_setopt(curl, CURLOPT_HEADERFUNCTION, &HttpClient::writeHeaderCb);
        curl_easy_setopt(curl, CURLOPT_HEADERDATA, &headers);
        if (headerList) curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headerList);

        CURLcode code = curl_easy_perform(curl);
        if (code != CURLE_OK) {
            std::ostringstream oss;
            oss << "cURL error: " << curl_easy_strerror(code);
            throw std::runtime_error(oss.str());
        }

        curl_easy_getinfo(curl, CURLINFO_RESPONSE_CODE, &resp.status);
        resp.body = std::move(body);
        resp.headers = std::move(headers);
        return resp;
    }

    HttpResponse HttpClient::get(const std::string& path,
        const std::vector<std::string>& headers,
        long timeoutMs) {
        CURL* curl = curl_easy_init();
        if (!curl) throw std::runtime_error("Failed to init CURL");
        std::string url = baseUrl_ + path;
        setCommonOpts(curl, url, timeoutMs);

        struct curl_slist* headerList = nullptr;
        for (const auto& h : headers) headerList = curl_slist_append(headerList, h.c_str());

        auto resp = perform(curl, headerList);

        if (headerList) curl_slist_free_all(headerList);
        curl_easy_cleanup(curl);

        if (resp.status < 200 || resp.status >= 300) {
            throw HttpError(resp.status, "HTTP " + std::to_string(resp.status) + ": " + resp.body);
        }
        return resp;
    }

    HttpResponse HttpClient::postJson(const std::string& path,
        const std::string& jsonBody,
        const std::vector<std::string>& headers,
        long timeoutMs) {
        CURL* curl = curl_easy_init();
        if (!curl) throw std::runtime_error("Failed to init CURL");
        std::string url = baseUrl_ + path;
        setCommonOpts(curl, url, timeoutMs);

        curl_easy_setopt(curl, CURLOPT_POST, 1L);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, jsonBody.c_str());
        curl_easy_setopt(curl, CURLOPT_POSTFIELDSIZE, jsonBody.size());

        struct curl_slist* headerList = nullptr;
        headerList = curl_slist_append(headerList, "Content-Type: application/json");
        for (const auto& h : headers) headerList = curl_slist_append(headerList, h.c_str());

        auto resp = perform(curl, headerList);

        if (headerList) curl_slist_free_all(headerList);
        curl_easy_cleanup(curl);

        if (resp.status < 200 || resp.status >= 300) {
            throw HttpError(resp.status, "HTTP " + std::to_string(resp.status) + ": " + resp.body);
        }
        return resp;
    }

    std::string HttpClient::urlEncode(const std::string& s) {
        char* out = curl_easy_escape(nullptr, s.c_str(), static_cast<int>(s.size()));
        if (!out) return s;
        std::string r(out);
        curl_free(out);
        return r;
    }

} // namespace util
