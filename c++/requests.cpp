#include <iostream>
#include "requests.h"

std::string GET(std::string URL)
{
    std::string cmd = "curl -s " + URL + " -H \"Accept: application/json\"";

    FILE* pipe = _popen(cmd.c_str(), "r");
    char buffer[128];
    std::string output = "";
        
    while (fgets(buffer, sizeof(buffer), pipe) != NULL) 
    {
        output += buffer;
    }

    _pclose(pipe);

    return output;
}

void POST(int count, std::string log, std::string uid, bool isFirstTime)
{
    std::string _firstruntime = isFirstTime ? std::to_string(GetTimeNow()) : ReadRunTime();
    std::ofstream info("resources/info.txt", std::ios::trunc);

    if (info.is_open())
    {
        info << count << "\n";
        info << _firstruntime << "\n";
        info << log << "\n";
        info << uid << "\n";
        info.close();
    }

    int post_status = system("post.exe");

    if (post_status != 0) PLOG_WARNING.printf("Failed syncing data, bot will still be running");
}

std::string ReadRunTime()
{
    std::ifstream inputFile("resources/info.txt");

    std::string line;
    std::getline(inputFile, line);
    std::getline(inputFile, line);

    inputFile.close();

    return line;
}