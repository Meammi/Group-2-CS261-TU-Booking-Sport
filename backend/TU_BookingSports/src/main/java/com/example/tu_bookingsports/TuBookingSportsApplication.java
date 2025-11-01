//backend\TU_BookingSports\src\main\java\com\example\tu_bookingsports\TuBookingSportsApplication.java
package com.example.tu_bookingsports;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TuBookingSportsApplication {

    public static void main(String[] args) {
        SpringApplication.run(TuBookingSportsApplication.class, args);
    }

}