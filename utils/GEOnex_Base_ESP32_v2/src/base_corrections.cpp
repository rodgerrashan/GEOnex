#include <Arduino.h>
#include "gnss_esp.h"
#include "WiFi.h"
#include "TinyGPSPlus.h"
#include <BasicLinearAlgebra.h>
#include "config.h"
#include "gps_manager.h"
#include <algorithm>

double calculateMean(const double arr[], int size){
    if (size == 0)
        return 0.0; // Avoid division by zero

    double sum = 0.0;
    for (int i = 0; i < size; i++){
        sum += arr[i];
    }
    return sum / size;
}

// Function to compute the median of an array
double median(double arr[], int size)
{
    std::sort(arr, arr + size); // Sort the array
    if (size % 2 == 0)
        return (arr[size / 2 - 1] + arr[size / 2]) / 2.0;
    else
        return arr[size / 2];
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

double *removeOutliers(double arr[], int size, int &newSize)
{
    if (size < 4)
    { // If too few elements, return the same array
        newSize = size;
        double *filteredArr = new double[newSize];
        std::copy(arr, arr + newSize, filteredArr);
        return filteredArr;
    }

    // Copy and sort the array
    double sortedArr[size];
    std::copy(arr, arr + size, sortedArr);
    std::sort(sortedArr, sortedArr + size);

    // Compute Q1 and Q3
    int mid = size / 2;
    double lowerHalf[mid], upperHalf[mid];

    std::copy(sortedArr, sortedArr + mid, lowerHalf);
    std::copy(sortedArr + (size % 2 == 0 ? mid : mid + 1), sortedArr + size, upperHalf);

    double Q1 = median(lowerHalf, mid);
    double Q3 = median(upperHalf, mid);
    double IQR = Q3 - Q1;

    double lowerBound = Q1 - 1.5 * IQR;
    double upperBound = Q3 + 1.5 * IQR;

    // Create a temporary array for filtered values
    double *tempArr = new double[size];
    newSize = 0;

    for (int i = 0; i < size; i++)
    {
        if (arr[i] >= lowerBound && arr[i] <= upperBound)
        {
            tempArr[newSize++] = arr[i];
        }
    }

    // Allocate exact-sized array for the result
    double *filteredArr = new double[newSize];
    std::copy(tempArr, tempArr + newSize, filteredArr);

    delete[] tempArr; // Free temporary memory
    return filteredArr;
}