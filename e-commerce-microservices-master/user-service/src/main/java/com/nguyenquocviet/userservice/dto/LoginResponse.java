package com.nguyenquocviet.userservice.dto;

public class LoginResponse {
    private Long id;
    private String userName;  
    private String authToken;

    // Default constructor
    public LoginResponse() {
    }

    // Constructor with all fields
    public LoginResponse(Long id, String userName, String authToken) {
        this.id = id;
        this.userName = userName;
        this.authToken = authToken;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getAuthToken() {
        return authToken;
    }

    public void setAuthToken(String authToken) {
        this.authToken = authToken;
    }
}
