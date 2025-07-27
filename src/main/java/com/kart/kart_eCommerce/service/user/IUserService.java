package com.kart.kart_eCommerce.service.user;


import com.kart.kart_eCommerce.dtos.UserDto;
import com.kart.kart_eCommerce.model.User;
import com.kart.kart_eCommerce.request.CreateUserRequest;
import com.kart.kart_eCommerce.request.UserUpdateRequest;

public interface IUserService {
    User createUser(CreateUserRequest request);
    User updateUser(UserUpdateRequest request, Long userId);
    User getUserById(Long userId);
    void deleteUser(Long userId);

     UserDto convertUserToDto(User user);

    User getAuthenticatedUser();
}
