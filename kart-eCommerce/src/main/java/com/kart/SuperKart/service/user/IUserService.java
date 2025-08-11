package com.kart.SuperKart.service.user;


import com.kart.SuperKart.dtos.UserDto;
import com.kart.SuperKart.model.User;
import com.kart.SuperKart.request.CreateUserRequest;
import com.kart.SuperKart.request.UserUpdateRequest;

public interface IUserService {
    User createUser(CreateUserRequest request);
    User updateUser(UserUpdateRequest request, Long userId);
    User getUserById(Long userId);
    void deleteUser(Long userId);

     UserDto convertUserToDto(User user);

    User getAuthenticatedUser();
}
