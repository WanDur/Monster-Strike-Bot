#pragma once
#include <windows.h>
#include <string>

namespace util 
{
	std::wstring ExeDir();
	std::wstring UniqueBmpPath();                 // capture_YYYYMMDD_HHMMSS_mmm.bmp
	bool SaveHBITMAPAsBMP(HBITMAP hbm, const std::wstring& path);
}
