package org.example.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.example.controllers.AccountController;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;

@Configuration
public class WebConfig implements WebMvcConfigurer {


    private final AccountController accountInterceptor;

    @Autowired
    public WebConfig(AccountController accountInterceptor) {
        this.accountInterceptor = accountInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(accountInterceptor)
                .addPathPatterns("/account/**");
    }
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // Разрешить CORS для всех путей
                .allowedOrigins("http://37.194.168.90:3000")  // Разрешает доступ только с указанного домена
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // Разрешить эти методы
                .allowedHeaders("*")  // Разрешить любые заголовки
                .allowCredentials(true);  // Разрешить отправку кросс-доменных куки
    }
}
