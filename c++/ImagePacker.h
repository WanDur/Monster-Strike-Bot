#pragma once
#include <cstdint>
#include <vector>
#include <string>
#include <fstream>
#include <iostream>

struct Header {
    uint32_t image_count;
};

struct TOCEntry {
    uint32_t offset;
    uint32_t size;
};

void pack_images(const std::vector<std::string>& image_filenames, const std::string& output_filename);

std::vector<uint8_t> read_image(const std::string& packed_images_filename, uint32_t image_index);