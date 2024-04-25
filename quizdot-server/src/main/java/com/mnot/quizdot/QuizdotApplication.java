package com.mnot.quizdot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class QuizdotApplication {

    public static void main(String[] args) {
        SpringApplication.run(QuizdotApplication.class, args);
    }
}
