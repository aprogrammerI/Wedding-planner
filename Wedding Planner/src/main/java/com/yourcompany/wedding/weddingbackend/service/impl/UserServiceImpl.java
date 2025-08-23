package com.yourcompany.wedding.weddingbackend.service.impl;

import com.yourcompany.wedding.weddingbackend.model.User;
import com.yourcompany.wedding.weddingbackend.repository.UserRepository;
import com.yourcompany.wedding.weddingbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
// import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    // private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository
    // , PasswordEncoder passwordEncoder
    ) 
    {
        this.userRepository = userRepository;
        // this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }

    @Override
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public User createUser(String name, String email, String password) {
        User user = User.builder()
                .name(name)
                .email(email) // Using email as username
                // .password(passwordEncoder.encode(password))
                .password(password)
                .role(User.Role.USER)
                .build();
        return userRepository.save(user);
    }

    @Override
    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found or invalid credentials"));

        // if (!passwordEncoder.matches(password, user.getPassword())) {
        //     throw new RuntimeException("Invalid credentials");
        // }
        return user;
    }
}
