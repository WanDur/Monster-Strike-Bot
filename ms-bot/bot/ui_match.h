#pragma once
#include <windows.h>
#include "ui_templates.h"

namespace bot 
{
	// match cropped area with template data
	void MatchTemplateRegion(HBITMAP hbm, MatchType type, bool debug);
}
