#include "globals.h"

bool isEnglish()
{
    HWND hwnd = FindWindow(nullptr, L"NoxPlayer");
    return (hwnd != nullptr);
}

/* replace the line with your emulator name
 * LPCWSTR emulatorNameLPCWSTR = L"your emulator"
 * const char* emulatorNameCHAR = "your emulator"
 */
LPCWSTR emulatorNameLPCWSTR = isEnglish() ? L"NoxPlayer" : L"夜神模擬器"; // change this 
const char* emulatorNameCHAR = isEnglish() ? "NoxPlayer" : "夜神模擬器";  // change this

const int kSupportedWidth[] = { 1920 };
const int kSupportedHeight[] = { 1080 };
const int kSupportedSize = sizeof(kSupportedWidth) / sizeof(kSupportedWidth[0]);