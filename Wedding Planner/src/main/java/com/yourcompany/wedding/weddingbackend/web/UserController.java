package com.yourcompany.wedding.weddingbackend.web;


import com.yourcompany.wedding.weddingbackend.dto.LoginDTO;
import com.yourcompany.wedding.weddingbackend.dto.LoginResponseDTO;
import com.yourcompany.wedding.weddingbackend.dto.RegisterDTO;
import com.yourcompany.wedding.weddingbackend.dto.RegisterResponseDTO;
import com.yourcompany.wedding.weddingbackend.dto.UserDto;
import com.yourcompany.wedding.weddingbackend.model.User;
import com.yourcompany.wedding.weddingbackend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDTO> registerUser(@RequestBody RegisterDTO registerDTO) {
        try {
            User user = userService.createUser(registerDTO.name(), registerDTO.email(), registerDTO.password());

            RegisterResponseDTO responseDTO = new RegisterResponseDTO(
                    user.getId(),
                    user.getName(),
                    user.getEmail()
            );

            return ResponseEntity.ok(responseDTO);
        }catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> loginUser(@RequestBody LoginDTO loginDTO) {
        try{
            User user = userService.login(loginDTO.email(), loginDTO.password());

            LoginResponseDTO responseDTO = new LoginResponseDTO(
                    user.getId(),
                    user.getEmail()
            );

            return ResponseEntity.ok(responseDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/users")
    public List<UserDto> getAll() {
        return userService.findAll().stream()
                .map(u -> new UserDto(u.getId(), u.getEmail(), u.getRole().name()))
                .collect(Collectors.toList());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserDto> getById(@PathVariable Long id) {
        return userService.findById(id)
                .map(u -> ResponseEntity.ok(new UserDto(u.getId(), u.getEmail(), u.getRole().name())))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UserDto> update(@PathVariable Long id, @RequestBody UserDto dto) {
        return userService.findById(id).map(existing -> {
            existing.setEmail(dto.getEmail());
            existing.setRole(User.Role.valueOf(dto.getRole()));
            User updated = userService.save(existing);
            return ResponseEntity.ok(new UserDto(updated.getId(), updated.getEmail(), updated.getRole().name()));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
