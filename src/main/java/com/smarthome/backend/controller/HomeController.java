package com.smarthome.backend.controller;

import com.smarthome.backend.entity.Home;
import com.smarthome.backend.repository.HomeRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/homes")
public class HomeController {

    private final HomeRepository homeRepository;

    public HomeController(HomeRepository homeRepository) {
        this.homeRepository = homeRepository;
    }

    @PostMapping
    public Home createHome(@RequestBody Home home) {
        return homeRepository.save(home);
    }

    @GetMapping
    public List<Home> getHomes() {
        return homeRepository.findAll();
    }
    @GetMapping("/{homeId}/active-count")
    public Integer getActiveDeviceCount(@PathVariable Long homeId) {
        return homeRepository.countActiveDevices(homeId);
    }
}