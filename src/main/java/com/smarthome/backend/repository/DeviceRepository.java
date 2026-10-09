package com.smarthome.backend.repository;

import com.smarthome.backend.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DeviceRepository extends JpaRepository<Device, Long> {

    @Query("""
        SELECT d
        FROM Device d
        JOIN FETCH d.home h
        JOIN FETCH h.user u
        """)
    List<Device> findDevicesWithHomeAndUser();

    @Query(value = """
        SELECT d.*
        FROM devices d
        JOIN (
            SELECT device_id, COUNT(*) AS log_count
            FROM device_logs
            GROUP BY device_id
        ) x ON d.device_id = x.device_id
        WHERE x.log_count > (
            SELECT AVG(log_count)
            FROM (
                SELECT COUNT(*) AS log_count
                FROM device_logs
                GROUP BY device_id
            ) avg_logs
        )
        """, nativeQuery = true)
    List<Device> findDevicesAboveAverageLogs();
}