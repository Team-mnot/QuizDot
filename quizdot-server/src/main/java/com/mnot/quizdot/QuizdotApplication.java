package com.mnot.quizdot;

import com.mnot.quizdot.domain.member.repository.RefreshTokenRedisRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan.Filter;
import org.springframework.context.annotation.FilterType;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaAuditing
@EnableJpaRepositories(
    basePackages = "com.mnot.quizdot.domain",
    excludeFilters =
    @Filter(type = FilterType.ASSIGNABLE_TYPE, value = RefreshTokenRedisRepository.class)
)
public class QuizdotApplication {

    public static void main(String[] args) {
        SpringApplication.run(QuizdotApplication.class, args);
    }
}
