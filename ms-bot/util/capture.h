#pragma once
#include <windows.h>

namespace util 
{
	/* capture emulator screen and return a 32-bit top-down HBITMAP.
	   If debug == true, saves the bitmap. */
	HBITMAP CaptureEmulatorRegion(const RECT& emulatorRect, bool debug);
}
