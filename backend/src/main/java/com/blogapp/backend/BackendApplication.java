
package com.blogapp.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BackendApplication {
	public static void main(String[] args) {
		ConfigurableApplicationContext context =
				SpringApplication.run(BackendApplication.class, args);

		PasswordEncoder encoder = context.getBean(PasswordEncoder.class);
		System.out.println("BCrypt hash: " + encoder.encode("NewPass123!"));
	}
}
