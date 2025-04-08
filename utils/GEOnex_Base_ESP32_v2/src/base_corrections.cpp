#include <Arduino.h>
#include "gnss_esp.h"
#include "WiFi.h"
#include "TinyGPSPlus.h"
#include <BasicLinearAlgebra.h>
#include "config.h"
#include "gps_manager.h"


double calculateMean(const double arr[], int size)
{
    if (size == 0)
        return 0.0; // Avoid division by zero

    double sum = 0.0;
    for (int i = 0; i < size; i++)
    {
        sum += arr[i];
    }
    return sum / size;
}

double kalmanFilter(double *data, int size)
{
    double estimate = data[0];          // Initial estimate (starting value)
    double errorCov = 1;                // Initial error covariance
    double processNoise = 0.000001;     // Process noise
    double measurementNoise = 0.000001; // Measurement noise (assumed GPS error)

    for (int i = 1; i < size; i++)
    {
        // Prediction Step: Only update the error covariance
        errorCov = errorCov + processNoise;

        // Compute Kalman Gain
        double gain = errorCov / (errorCov + measurementNoise);

        // Correction Step: Update estimate based on new measurement
        estimate = estimate + gain * (data[i] - estimate);

        // Update error covariance
        errorCov = (1 - gain) * errorCov;
    }

    return estimate;
}