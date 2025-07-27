package com.kart.kart_eCommerce.dtos;

import com.kart.kart_eCommerce.dtos.CartDto;
import com.kart.kart_eCommerce.dtos.OrderDto;
import lombok.Data;

import java.util.List;

@Data
public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private List<OrderDto> orders;
    private CartDto cart;
    private List<AddressDto> addressList;

}