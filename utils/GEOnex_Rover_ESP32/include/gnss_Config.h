#ifndef GNSS_CONFIG_H
#define GNSS_CONFIG_H

#include <Arduino.h>

class GNSSConfig
{
public:
    static void enableGNSS(Stream &serial);
};

#endif