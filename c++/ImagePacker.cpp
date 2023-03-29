#include "ImagePacker.h"

/*
 std::vector<std::string> image_filenames = { "card.png", "level.png", "maximize.png", "minimize.png", "ok.png"};
 std::string packed_images_filename = "im.dur";
 pack_images(image_filenames, packed_images_filename);
 */
void pack_images(const std::vector<std::string>& image_filenames, const std::string& output_filename) 
{
    Header header;
    header.image_count = static_cast<uint32_t>(image_filenames.size());

    std::vector<TOCEntry> toc_entries;
    std::vector<std::vector<uint8_t>> image_data;

    uint32_t current_offset = sizeof(Header) + sizeof(TOCEntry) * header.image_count;

    for (const auto& filename : image_filenames) {
        std::ifstream input(filename, std::ios::binary);
        std::vector<uint8_t> buffer(std::istreambuf_iterator<char>(input), {});

        TOCEntry toc_entry;
        toc_entry.offset = current_offset;
        toc_entry.size = static_cast<uint32_t>(buffer.size());
        toc_entries.push_back(toc_entry);

        current_offset += toc_entry.size;
        image_data.push_back(buffer);
    }

    std::ofstream output(output_filename, std::ios::binary);
    output.write(reinterpret_cast<char*>(&header), sizeof(Header));
    output.write(reinterpret_cast<char*>(toc_entries.data()), sizeof(TOCEntry) * header.image_count);

    for (const auto& image : image_data) {
        output.write(reinterpret_cast<const char*>(image.data()), image.size());
    }
}

std::vector<uint8_t> read_image(const std::string& packed_images_filename, uint32_t image_index) 
{
    std::ifstream input(packed_images_filename, std::ios::binary);

    Header header;
    input.read(reinterpret_cast<char*>(&header), sizeof(Header));

    input.seekg(sizeof(Header) + sizeof(TOCEntry) * image_index);
    TOCEntry toc_entry;
    input.read(reinterpret_cast<char*>(&toc_entry), sizeof(TOCEntry));

    std::vector<uint8_t> buffer(toc_entry.size);
    input.seekg(toc_entry.offset);
    input.read(reinterpret_cast<char*>(buffer.data()), toc_entry.size);

    return buffer;
}
