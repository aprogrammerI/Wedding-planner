package com.yourcompany.wedding.weddingbackend.web;


import com.yourcompany.wedding.weddingbackend.dto.UserDto;
import com.yourcompany.wedding.weddingbackend.model.User;
import com.yourcompany.wedding.weddingbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserDto> getAll() {
        return userService.findAll().stream()
                .map(u -> new UserDto(u.getId(), u.getUsername(), u.getRole().name()))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getById(@PathVariable Long id) {
        return userService.findById(id)
                .map(u -> ResponseEntity.ok(new UserDto(u.getId(), u.getUsername(), u.getRole().name())))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public UserDto create(@RequestBody UserDto dto) {
        User u = User.builder()
                .username(dto.getUsername())
                .password("<encrypted>") // handle encoding elsewhere
                .role(User.Role.valueOf(dto.getRole()))
                .build();
        User saved = userService.save(u);
        return new UserDto(saved.getId(), saved.getUsername(), saved.getRole().name());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> update(@PathVariable Long id, @RequestBody UserDto dto) {
        return userService.findById(id).map(existing -> {
            existing.setUsername(dto.getUsername());
            existing.setRole(User.Role.valueOf(dto.getRole()));
            User updated = userService.save(existing);
            return ResponseEntity.ok(new UserDto(updated.getId(), updated.getUsername(), updated.getRole().name()));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
