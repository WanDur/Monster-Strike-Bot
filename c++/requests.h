#pragma once
#include <string>
#include <fstream>

#include <plog/Log.h>

#include "utils.h"

std::string GET(std::string);

void POST(int count, std::string log, std::string uid, bool isFirstTime = false);

std::string ReadRunTime();