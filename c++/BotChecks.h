#pragma once
#include <Windows.h>
#include <string>

#include <opencv2/opencv.hpp>
#include <nlohmann/json.hpp>
#include <plog/Log.h>

#include "requests.h"

BOOL CALLBACK EnumWindowsProc(HWND hwnd, LPARAM lParam);

double getLatestVersion();

bool isVersionMatch(double currVersion);

bool isEnglish();

extern const char* emulatorNameCHAR;
extern LPCWSTR emulatorNameLPCWSTR;