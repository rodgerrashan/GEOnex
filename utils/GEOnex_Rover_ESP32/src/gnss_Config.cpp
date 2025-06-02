#include "gnss_config.h"

// UBX-CFG-GNSS: Enable GPS + Galileo + BeiDou
uint8_t ubxGNSSConfig[] = {
    0xB5, 0x62, 0x06, 0x3E, 0x24, 0x00,
    0x00, 0x03, 0x00, 0x07, // msgVer, numTrkChHw, numTrkChUse, numConfigBlocks

    0x00, 0x00, 0x10, 0x01, // GPS      (enabled)
    0x01, 0x00, 0x03, 0x00, // SBAS     (disabled)
    0x02, 0x00, 0x08, 0x01, // Galileo  (enabled)
    0x03, 0x00, 0x08, 0x01, // BeiDou   (enabled)
    0x04, 0x00, 0x00, 0x00, // IMES     (disabled)
    0x05, 0x00, 0x03, 0x00, // QZSS     (disabled)
    0x06, 0x00, 0x10, 0x00, // GLONASS  (disabled)

    0x00, 0x00 // Checksum placeholders
};

void calcChecksum(uint8_t *msg, size_t len, uint8_t &ckA, uint8_t &ckB)
{
    ckA = 0;
    ckB = 0;
    for (size_t i = 2; i < len - 2; i++)
    {
        ckA += msg[i];
        ckB += ckA;
    }
}

void sendUBX(uint8_t *msg, size_t len, Stream &serial)
{
    uint8_t ckA, ckB;
    calcChecksum(msg, len, ckA, ckB);
    msg[len - 2] = ckA;
    msg[len - 1] = ckB;

    serial.write(msg, len);
}

void GNSSConfig::enableGNSS(Stream &serial)
{
    sendUBX(ubxGNSSConfig, sizeof(ubxGNSSConfig), serial);
}
