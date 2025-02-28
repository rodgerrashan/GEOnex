#ifndef BASE_CORRECTION_H
#define BASE_CORRECTION_H

// Structure to store base fixed position data
struct FIXEDData
{
    double latitude;
    double longitude;
    bool isValid;
};

double calculateMean(const double arr[], int size);
double kalmanFilter(double *data, int size);

#endif