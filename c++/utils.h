#pragma once
#include <windows.h>
#include <cstdlib> 
#include <ctime>
#include <string>
#include <opencv2/opencv.hpp>
#include <chrono>
#include <random>

#include <plog/Log.h>

#include "BotChecks.h"
#include "ImagePacker.h"

struct Point 
{
    int x;
    int y;
};

int randint(int min, int max);

void moveTo(Point target_pos);

void dragTo(Point target_pos, DWORD duration);

void click();

void doubleclick();

void fullSpamClick(int middleX, int fromY, int toY);

cv::Mat hwndToMat(HWND hwnd);

bool isImageOnScreen(cv::Mat imageData, double confidence, cv::Point& imgCoord);

// image should be 0-4 { CARD, LEVEL, MAXIMIZE, MINIMIZE, OK }
bool foundImage(int image, Point& imgCoord, double c = 0.8);

int GetTimeNow();

std::string convertTimeToString(int seconds, bool showAll = true);

void show_error_box(const wchar_t* text);

void adjustWindowSize(int newWidth, int newHeight);

void confirmWindowSize();

std::string generate_uid(int length = 4);

std::string log_info(std::string status, std::string message, int counter);
