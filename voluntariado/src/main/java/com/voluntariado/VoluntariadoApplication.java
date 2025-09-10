package com.voluntariado;

import com.voluntariado.entity.Rol;
import com.voluntariado.entity.Usuario;
import com.voluntariado.repository.RolRepository;
import com.voluntariado.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class VoluntariadoApplication {

	public static void main(String[] args) {
		SpringApplication.run(VoluntariadoApplication.class, args);
	}

    @Bean
    CommandLineRunner initRoles(RolRepository rolRepository) {
        return args -> {
            if (rolRepository.findByNombre("ADMIN").isEmpty()) {
                rolRepository.save(Rol.builder().nombre("ADMIN").build());
            }
            if (rolRepository.findByNombre("ORGANIZADOR").isEmpty()) {
                rolRepository.save(Rol.builder().nombre("ORGANIZADOR").build());
            }
            if (rolRepository.findByNombre("VOLUNTARIO").isEmpty()) {
                rolRepository.save(Rol.builder().nombre("VOLUNTARIO").build());
            }
        };
    }

}
