package com.smarthome.backend.repository;

import com.smarthome.backend.entity.Home;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface HomeRepository extends JpaRepository<Home, Long> {

    @Query(value = "SELECT count_active_devices(:homeId)", nativeQuery = true)
    Integer countActiveDevices(@Param("homeId") Long homeId);
}