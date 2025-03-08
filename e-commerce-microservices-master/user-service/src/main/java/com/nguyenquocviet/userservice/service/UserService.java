package com.nguyenquocviet.userservice.service;

import com.nguyenquocviet.userservice.entity.User;
import java.util.List;

public interface UserService {
    List<User> getAllUsers();
    User getUserById(Long id);
    User getUserByName(String userName);
    User saveUser(User user);
    User updateUser(Long id, User user);
    void deleteUser(Long id);
}
