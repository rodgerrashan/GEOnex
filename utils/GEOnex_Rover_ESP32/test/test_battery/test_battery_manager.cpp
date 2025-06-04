#include <unity.h>
#include "battery_manager.h"

// --------- Test getBatteryPercentage() ----------
void test_full_battery()
{
    TEST_ASSERT_EQUAL(100, getBatteryPercentage(4.2));
}

void test_empty_battery()
{
    TEST_ASSERT_EQUAL(0, getBatteryPercentage(3.2));
}

void test_half_battery()
{
    TEST_ASSERT_EQUAL(50, getBatteryPercentage(3.7)); // midway between 3.2 and 4.2
}

void test_overflow_voltage()
{
    TEST_ASSERT_EQUAL(100, getBatteryPercentage(4.5));
}

void test_underflow_voltage()
{
    TEST_ASSERT_EQUAL(0, getBatteryPercentage(3.0));
}

void setup()
{
    UNITY_BEGIN();
    RUN_TEST(test_full_battery);
    RUN_TEST(test_empty_battery);
    RUN_TEST(test_half_battery);
    RUN_TEST(test_overflow_voltage);
    RUN_TEST(test_underflow_voltage);
    UNITY_END();
}

void loop()
{
    // Nothing here
}
