#include "rtk_correction.h"

// Returns the corrected GPS coordinates
GPSCoord rtk_correction(double rawLat, double rawLon, double corrLat, double corrLon)
{
    GPSCoord corrected;
    corrected.latitude = rawLat - corrLat;
    corrected.longitude = rawLon - corrLon;
    return corrected;
}
