#pragma once
#include <windows.h>
#include <cstdlib> 
#include <ctime>
#include <string>
#include <opencv2/opencv.hpp>
#include <chrono>
#include <random>

#include <plog/Log.h>

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

cv::Mat hwndToMat(HWND hwnd);

bool isImageOnScreen(std::string imagePath, double confidence, cv::Point& imgCoord);

bool foundImage(std::string image, Point& imgCoord, double c = 0.8);

int GetTimeNow();

std::string convertTimeToString(int seconds, bool showAll = true);

void show_error_box(const wchar_t* text);

void adjustWindowSize(int newWidth, int newHeight);

void confirmWindowSize();

std::string generate_uid(int length = 5);

std::string log_info(std::string status, std::string message, int counter);
