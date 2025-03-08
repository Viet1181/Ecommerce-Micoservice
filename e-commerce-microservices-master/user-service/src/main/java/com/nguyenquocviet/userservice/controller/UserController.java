package com.nguyenquocviet.userservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nguyenquocviet.userservice.entity.User;
import com.nguyenquocviet.userservice.http.header.HeaderGenerator;
import com.nguyenquocviet.userservice.service.UserService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.List;

@RestController
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private HeaderGenerator headerGenerator;
    
    @GetMapping (value = "/users")
    public ResponseEntity<List<User>> getAllUsers(){
        List<User> users =  userService.getAllUsers();
        if(!users.isEmpty()) {
        	return new ResponseEntity<List<User>>(
        		users,
        		headerGenerator.getHeadersForSuccessGetMethod(),
        		HttpStatus.OK);
        }
        return new ResponseEntity<List<User>>(
        		headerGenerator.getHeadersForError(),
        		HttpStatus.NOT_FOUND);
    }

    @GetMapping (value = "/users", params = "name")
    public ResponseEntity<User> getUserByName(@RequestParam("name") String userName){
    	User user = userService.getUserByName(userName);
    	if(user != null) {
    		return new ResponseEntity<User>(
    				user,
    				headerGenerator.
    				getHeadersForSuccessGetMethod(),
    				HttpStatus.OK);
    	}
        return new ResponseEntity<User>(
        		headerGenerator.getHeadersForError(),
        		HttpStatus.NOT_FOUND);
    }

    @GetMapping (value = "/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") Long id){
        User user = userService.getUserById(id);
        if(user != null) {
    		return new ResponseEntity<User>(
    				user,
    				headerGenerator.
    				getHeadersForSuccessGetMethod(),
    				HttpStatus.OK);
    	}
        return new ResponseEntity<User>(
        		headerGenerator.getHeadersForError(),
        		HttpStatus.NOT_FOUND);
    }

    @PostMapping (value = "/users")
    public ResponseEntity<?> addUser(@RequestBody User user, HttpServletRequest request){
        if(user != null) {
            try {
                System.out.println("Đang xử lý đăng ký user: " + user.getUserName());
                userService.saveUser(user);
                return new ResponseEntity<User>(
                        user,
                        headerGenerator.getHeadersForSuccessPostMethod(request, user.getId()),
                        HttpStatus.CREATED);
            } catch (Exception e) {
                e.printStackTrace();
                String errorMessage = "Lỗi khi đăng ký user: " + e.getMessage();
                System.err.println(errorMessage);
                return new ResponseEntity<>(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>("User không hợp lệ", HttpStatus.BAD_REQUEST);
    }

    @PutMapping(value = "/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable("id") Long id, @RequestBody User user) {
        try {
            User updatedUser = userService.updateUser(id, user);
            if (updatedUser != null) {
                return new ResponseEntity<User>(
                        updatedUser,
                        headerGenerator.getHeadersForSuccessGetMethod(),
                        HttpStatus.OK);
            }
        } catch (RuntimeException e) {
            return new ResponseEntity<User>(
                    headerGenerator.getHeadersForError(),
                    HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<User>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<User>(HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping(value = "/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") Long id) {
        try {
            userService.deleteUser(id);
            return new ResponseEntity<Void>(
                    headerGenerator.getHeadersForSuccessGetMethod(),
                    HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<Void>(
                    headerGenerator.getHeadersForError(),
                    HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<Void>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return new ResponseEntity<>(
            "Logged out successfully",
            headerGenerator.getHeadersForSuccessGetMethod(),
            HttpStatus.OK
        );
    }
}
