#ifndef RTK_CORRECTION_H
#define RTK_CORRECTION_H

struct GPSCoord
{
    double latitude;
    double longitude;
};

// Apply RTK correction by subtracting correction offsets
GPSCoord rtk_correction(double rawLat, double rawLon, double corrLat, double corrLon);

#endif
