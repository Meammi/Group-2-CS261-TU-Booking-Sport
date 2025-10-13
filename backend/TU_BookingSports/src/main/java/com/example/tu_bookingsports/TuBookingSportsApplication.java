package com.example.tu_bookingsports;

//import com.github.pheerathach.ThaiQRPromptPay;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.WebApplicationType;

import java.math.BigDecimal;

@SpringBootApplication
public class TuBookingSportsApplication {

    public static void main(String[] args) {

        //SpringApplication.run(TuBookingSportsApplication.class, args);
        SpringApplication app = new SpringApplication(TuBookingSportsApplication.class);
        app.setWebApplicationType(WebApplicationType.SERVLET);
        app.run(args);
    }

}
