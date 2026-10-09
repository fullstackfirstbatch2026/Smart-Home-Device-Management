package com.smarthome.backend.controller;

import com.smarthome.backend.entity.DeviceLog;
import com.smarthome.backend.repository.DeviceLogRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/device-logs")
public class DeviceLogController {

    private final DeviceLogRepository deviceLogRepository;

    public DeviceLogController(DeviceLogRepository deviceLogRepository) {
        this.deviceLogRepository = deviceLogRepository;
    }

    @GetMapping
    public List<DeviceLog> getLogs() {
        return deviceLogRepository.findAll();
    }
}
