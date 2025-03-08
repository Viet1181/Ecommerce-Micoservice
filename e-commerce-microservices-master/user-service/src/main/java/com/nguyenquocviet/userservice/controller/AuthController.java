package com.nguyenquocviet.userservice.controller;

import com.nguyenquocviet.userservice.dto.LoginRequest;
import com.nguyenquocviet.userservice.dto.LoginResponse;
import com.nguyenquocviet.userservice.entity.User;
import com.nguyenquocviet.userservice.service.UserService;
import com.nguyenquocviet.userservice.utils.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("Login request received for user: " + loginRequest.getUserName());
            User user = userService.getUserByName(loginRequest.getUserName());
            System.out.println("User retrieved: " + user);
            
            if (user != null && passwordEncoder.matches(loginRequest.getPassword(), user.getUserPassword())) {
                String authToken = jwtTokenUtil.generateToken(user);
                
                LoginResponse response = new LoginResponse(
                    user.getId(),
                    user.getUserName(),
                    "Bearer " + authToken
                );
                System.out.println("Login successful. Returning response: " + response);
                return ResponseEntity.ok(response);
            }
            
            System.out.println("Invalid username or password. Returning bad request response.");
            return ResponseEntity.badRequest().body("Invalid username or password");
        } catch (Exception e) {
            System.out.println("Exception occurred: " + e.getMessage());
            e.printStackTrace();
            System.out.println("Error during login. Returning internal server error response.");
            return ResponseEntity.internalServerError().body("Error during login: " + e.getMessage());
        }
    }
}
