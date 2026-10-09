
        package com.smarthome.backend.controller;

import com.smarthome.backend.entity.Device;
import com.smarthome.backend.repository.DeviceRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    private final DeviceRepository deviceRepository;

    public DeviceController(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    // Add a new device
    @PostMapping
    public Device createDevice(@RequestBody Device device) {
        return deviceRepository.save(device);
    }

    // Get all devices
    @GetMapping
    public List<Device> getDevices() {
        return deviceRepository.findAll();
    }

    // Get devices with Home and User details
    @GetMapping("/details")
    public List<Device> getDeviceDetails() {
        return deviceRepository.findDevicesWithHomeAndUser();
    }

    // Get devices whose log count is above average
    @GetMapping("/above-average-logs")
    public List<Device> getDevicesAboveAverageLogs() {
        return deviceRepository.findDevicesAboveAverageLogs();
    }

    // Turn a device ON or OFF
    @PutMapping("/{deviceId}/status")
    public Device updateDeviceStatus(
            @PathVariable Long deviceId,
            @RequestBody Map<String, String> request) {

        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Device not found"));

        String newStatus = request.get("status");

        if (!"ON".equalsIgnoreCase(newStatus)
                && !"OFF".equalsIgnoreCase(newStatus)) {
            throw new RuntimeException("Status must be ON or OFF");
        }

        device.setStatus(newStatus.toUpperCase());

        return deviceRepository.save(device);
    }
}

