#include "utils.h"
#include "ScreenConfig.h"

ScreenConfig& screenConfig = ScreenConfig::getInstance();

int randint(int min, int max) 
{
    // Generate random number from given range, min / max inclusive
    srand(static_cast<unsigned int>(time(NULL)));
    int rand_num = rand() % (max - min + 1) + min;

    return rand_num;
}

void moveTo(Point target_pos)
{
    SetCursorPos(target_pos.x, target_pos.y);
    Sleep(100);
}

void dragTo(Point target_pos, DWORD duration) {
    POINT start_pos;
    GetCursorPos(&start_pos);

    // Calculate the distance to move the mouse
    int delta_x = target_pos.x - start_pos.x;
    int delta_y = target_pos.y - start_pos.y;

    // Calculate the number and duration of each step
    int num_steps = 20;
    DWORD step_duration = duration / num_steps;

    // Calculate the distance for each step
    double step_x = delta_x / (double)num_steps;
    double step_y = delta_y / (double)num_steps;

    // Start drag
    mouse_event(MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0); 
    for (int i = 1; i <= num_steps; i++) {
        int x = start_pos.x + (int)(i * step_x);
        int y = start_pos.y + (int)(i * step_y);

        SetCursorPos(x, y);
        Sleep(step_duration);
    }
    // End drag
    mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, 0);
}

void click()
{
    mouse_event(MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0);
    Sleep(100);
    mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, 0);
}

void doubleclick()
{
    click();
    Sleep(200);
    click();
}

void fullSpamClick(int middleX, int fromY, int toY)
{
    int delta_y = toY - fromY;
    double step_y = delta_y / (double)20;

    for (int i = 0; i <= 20; i++)
    {
        moveTo(Point{ middleX, static_cast<int>(fromY + i * step_y) });
        click();
        Sleep(200);
    }
}

cv::Mat hwndToMat(HWND hwnd)
{
    HDC hwindowDC, hwindowCompatibleDC;
    int height, width, srcheight, srcwidth;
    HBITMAP hbwindow;
    cv::Mat src;
    BITMAPINFOHEADER bi;

    // Get the device context for the window
    hwindowDC = GetDC(hwnd);
    hwindowCompatibleDC = CreateCompatibleDC(hwindowDC);
    SetStretchBltMode(hwindowCompatibleDC, COLORONCOLOR);

    // Get the area size of the desktop window (screenshot)
    RECT windowsize;
    GetClientRect(hwnd, &windowsize);

    // Get the dimensions of the screenshot
    srcheight = windowsize.bottom;
    srcwidth = windowsize.right;
    height = windowsize.bottom;
    width = windowsize.right;

    // Create cv::Mat object to store the data
    src.create(height, width, CV_8UC4);

    // Create a bitmap
    hbwindow = CreateCompatibleBitmap(hwindowDC, width, height);
    bi.biSize = sizeof(BITMAPINFOHEADER);
    bi.biWidth = width;
    bi.biHeight = -height;
    bi.biPlanes = 1;
    bi.biBitCount = 32;
    bi.biCompression = BI_RGB;
    bi.biSizeImage = 0;
    bi.biXPelsPerMeter = 0;
    bi.biYPelsPerMeter = 0;
    bi.biClrUsed = 0;
    bi.biClrImportant = 0;

    // Select bitmap and copy the screenshot context
    // Store it in cv::Mat and clean up
    SelectObject(hwindowCompatibleDC, hbwindow);
    StretchBlt(hwindowCompatibleDC, 0, 0, width, height, hwindowDC, 0, 0, srcwidth, srcheight, SRCCOPY);
    GetDIBits(hwindowCompatibleDC, hbwindow, 0, height, src.data, (BITMAPINFO*)&bi, DIB_RGB_COLORS);
    DeleteObject(hbwindow);
    DeleteDC(hwindowCompatibleDC);
    ReleaseDC(hwnd, hwindowDC);

    // Convert from BGRA to BGR for later comparison
    cv::Mat output;
    cv::cvtColor(src, output, cv::COLOR_BGRA2BGR);

    return output;
}


bool isImageOnScreen(cv::Mat imageData, double confidence, cv::Point& imgCoord)
{
    HWND hDesktopWnd;
    hDesktopWnd = GetDesktopWindow();
    cv::Mat screenshot = hwndToMat(hDesktopWnd);

    cv::cvtColor(imageData, imageData, cv::COLOR_BGRA2BGR);

    cv::Mat result;
    cv::matchTemplate(screenshot, imageData, result, cv::TM_CCOEFF_NORMED);

    double maxVal;
    cv::Point maxLoc;
    cv::minMaxLoc(result, NULL, &maxVal, NULL, &maxLoc);

    if (maxVal > confidence) 
    {
        imgCoord = maxLoc;
        return true;
    }
    else return false;
}

// image should be 0-4 { CARD, LEVEL, MAXIMIZE, MINIMIZE, OK }
bool foundImage(int image, Point& imgCoord, double c)
{
    cv::Point cv_imgCoord{ 0,0 };

    std::vector<uint8_t> image_data = read_image(screenConfig.imagePath_, image);
    cv::Mat decoded_image = cv::imdecode(cv::Mat(image_data), cv::IMREAD_UNCHANGED);

    bool isImgExist = isImageOnScreen(decoded_image, c, cv_imgCoord);

    imgCoord.x = cv_imgCoord.x;
    imgCoord.y = cv_imgCoord.y;

    return isImgExist;
}

int GetTimeNow()
{
    auto start = std::chrono::system_clock::now();
    std::time_t now_time_t = std::chrono::system_clock::to_time_t(start);
    return static_cast<int>(static_cast<std::chrono::seconds>(now_time_t).count());
}

std::string convertTimeToString(int seconds, bool showAll)
{
    seconds = seconds % (24 * 3600);
    int hour = seconds / 3600;
    seconds %= 3600;
    int minutes = seconds / 60;
    seconds %= 60;

    std::stringstream ss;
    if (showAll)
    {
        ss << hour << ":" << std::setfill('0') << std::setw(2) << minutes << ":" << std::setw(2) << seconds;
        return ss.str();
    }
    else
    {
        ss << std::setfill('0') << std::setw(2) << minutes << ":" << std::setw(2) << seconds << "s";
        return ss.str();
    }
}

void show_error_box(const wchar_t* text) 
{
    MessageBoxW(NULL, text, L"", MB_ICONERROR | MB_OK);
}

void adjustWindowSize(int newWidth, int newHeight) 
{
    HWND hwnd = FindWindow(nullptr, emulatorNameLPCWSTR);
    RECT rect;
    GetWindowRect(hwnd, &rect);

    if ((rect.right - rect.left) != screenConfig.emulatorWidth_ || (rect.bottom - rect.top) != screenConfig.emulatorHeight_)
    {
        SetWindowPos(hwnd, nullptr, rect.right - newWidth, rect.bottom - newHeight, newWidth, newHeight, SWP_NOZORDER);
        Sleep(100);
    }
}

void confirmWindowSize()
{
    Point target_pos{ 0,0 };
    if (foundImage(2, target_pos))
    {
        moveTo(target_pos);
        Sleep(100);
        click();
    }
    Sleep(300);
    if (foundImage(3, target_pos))
    {
        moveTo(target_pos);
        Sleep(100);
        click();
    }
    moveTo(Point{ screenConfig.screenWidth_ / 2,screenConfig.screenHeight_ / 2 });
}

std::string generate_uid(int length)
{
    std::string chars = "abcdefghjkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    std::string uid = "";
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(0, static_cast<int>(chars.size() - 1));
    for (int i = 0; i < length; ++i) 
    {
        uid += chars[dis(gen)];
    }
    return uid;
}

std::string log_info(std::string status, std::string message, int counter)
{
    int timestamp = GetTimeNow();
    const std::time_t timestamp_t = static_cast<std::time_t>(timestamp);

    std::tm tm_time;
    localtime_s(&tm_time, &timestamp_t);
    std::ostringstream oss;
    oss << std::put_time(&tm_time, " %m-%d %H:%M:%S");

    std::string dt = oss.str();

    if (counter == 0)
        return status + dt + " " + message;
    else if (message.empty() && counter == 0)
        return status + dt + " Initiated";

    return status + dt + " Round-" + std::to_string(counter) + " " + message;
}

