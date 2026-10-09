package com.smarthome.backend.repository;

import com.smarthome.backend.entity.DeviceLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeviceLogRepository extends JpaRepository<DeviceLog, Long> {
}
