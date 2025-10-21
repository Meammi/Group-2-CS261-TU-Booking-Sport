//backend\TU_BookingSports\src\main\java\com\example\tu_bookingsports\ServletInitializer.java
package com.example.tu_bookingsports;

import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

public class ServletInitializer extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(TuBookingSportsApplication.class);
    }

}
