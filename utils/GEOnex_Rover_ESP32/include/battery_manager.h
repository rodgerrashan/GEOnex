#ifndef BATTERY_MANAGER_H
#define BATTERY_MANAGER_H

void initBatteryMonitor();
float readBatteryVoltage();
int getBatteryPercentage(float voltage);

#endif
