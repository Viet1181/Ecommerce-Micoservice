package com.nguyenquocviet.userservice.service;

import com.nguyenquocviet.userservice.entity.User;
import com.nguyenquocviet.userservice.entity.UserRole;
import com.nguyenquocviet.userservice.entity.UserDetails;
import com.nguyenquocviet.userservice.repository.UserRepository;
import com.nguyenquocviet.userservice.repository.UserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    @Override
    public User getUserByName(String userName) {
        return userRepository.findByUserName(userName);
    }

    @Override
    @Transactional
    public User saveUser(User user) {
        try {
            // Check role first
            UserRole roleToUse;
            if (user.getRole() != null) {
                String roleName = user.getRole().getRoleName();
                System.out.println("Finding role with name: " + roleName);
                
                Optional<UserRole> existingRole = userRoleRepository.findByRoleName(roleName);
                if (!existingRole.isPresent()) {
                    throw new RuntimeException("Role không hợp lệ: " + roleName);
                }
                roleToUse = existingRole.get();
                System.out.println("Found role: " + roleToUse.getRoleName() + " (ID: " + roleToUse.getId() + ")");
            } else {
                // Set default role if not specified
                System.out.println("No role specified, using default ROLE_USER");
                Optional<UserRole> defaultRole = userRoleRepository.findByRoleName("ROLE_USER");
                if (!defaultRole.isPresent()) {
                    throw new RuntimeException("Không tìm thấy role mặc định ROLE_USER");
                }
                roleToUse = defaultRole.get();
            }

            // Encrypt password
            user.setUserPassword(passwordEncoder.encode(user.getUserPassword()));
            
            // Set the role after validation
            user.setRole(roleToUse);
            
            // Save user with all details
            System.out.println("Saving user: " + user.getUserName() + " with role: " + user.getRole().getRoleName());
            User savedUser = userRepository.save(user);
            System.out.println("User saved successfully with ID: " + savedUser.getId());
            return savedUser;
        } catch (Exception e) {
            System.err.println("Error saving user: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id);
        user.setUserName(userDetails.getUserName());
        if (userDetails.getUserPassword() != null && !userDetails.getUserPassword().isEmpty()) {
            user.setUserPassword(passwordEncoder.encode(userDetails.getUserPassword()));
        }
        user.setActive(userDetails.getActive());
        if (userDetails.getUserDetails() != null) {
            user.setUserDetails(userDetails.getUserDetails());
        }
        if (userDetails.getRole() != null) {
            user.setRole(userDetails.getRole());
        }
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        userRepository.delete(user);
    }
}
