#include <unity.h>
#include "mpu_correction.h"

void setUp(void) {}    // Required by Unity
void tearDown(void) {} // Required by Unity

void test_zero_tilt()
{
    double lat = 10.0, lon = 79.0;
    correctGPSCoordinates(lat, lon, 0.0, 0.0, 2.0);
    TEST_ASSERT_FLOAT_WITHIN(0.000001, 10.0, lat);
    TEST_ASSERT_FLOAT_WITHIN(0.000001, 79.0, lon);
}

void test_pitch_only()
{
    double lat = 10.0, lon = 79.0;
    correctGPSCoordinates(lat, lon, 90.0, 0.0, 1.0);
    TEST_ASSERT_TRUE(lat > 10.0);
    TEST_ASSERT_FLOAT_WITHIN(0.000001, 79.0, lon);
}

void test_roll_only()
{
    double lat = 10.0, lon = 79.0;
    correctGPSCoordinates(lat, lon, 0.0, 90.0, 1.0);
    TEST_ASSERT_FLOAT_WITHIN(0.000001, 10.0, lat);
    TEST_ASSERT_TRUE(lon > 79.0);
}

int main(int argc, char **argv)
{
    UNITY_BEGIN();
    RUN_TEST(test_zero_tilt);
    RUN_TEST(test_pitch_only);
    RUN_TEST(test_roll_only);
    return UNITY_END();
}
