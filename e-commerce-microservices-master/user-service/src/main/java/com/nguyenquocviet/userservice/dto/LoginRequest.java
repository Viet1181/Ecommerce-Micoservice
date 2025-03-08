package com.nguyenquocviet.userservice.dto;

public class LoginRequest {
    private String userName;
    private String password;
    private int active;

    // Default constructor
    public LoginRequest() {
    }

    // Constructor with all fields
    public LoginRequest(String userName, String password, int active) {
        this.userName = userName;
        this.password = password;
        this.active = active;
    }

    // Getters and setters
    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getActive() {
        return active;
    }

    public void setActive(int active) {
        this.active = active;
    }
}
