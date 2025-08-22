#pragma once
#include <windows.h>
#include "ui_templates.h"

namespace bot
{
	// Click by a template type
	bool ClickByType(HWND hwndEmulator, MatchType type);

	// Click by an absolute point
	bool Click(POINT screenPt);
}