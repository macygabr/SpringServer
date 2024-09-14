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

    private String[] allowedOrigins = {
        "http://37.194.168.90:3000",
        "http://10.54.202.32",
        "http://127.0.0.1:3000"     
    };

    private final AccountController accountInterceptor;

    @Autowired
    public WebConfig(AccountController accountInterceptor) {
        this.accountInterceptor = accountInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(accountInterceptor)
                .addPathPatterns("/myAccount/**");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // Настраивает CORS для всех путей
                .allowedOrigins(allowedOrigins)  // Разрешает доступ только с указанного домена
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // Разрешает только указанные HTTP-методы
                .allowedHeaders("*")  // Разрешает любые заголовки
                .allowCredentials(true);  // Разрешает отправку credentials, например, куки
    }
}
