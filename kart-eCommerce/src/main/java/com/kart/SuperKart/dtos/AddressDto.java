package com.kart.SuperKart.dtos;

import lombok.Data;

@Data
public class AddressDto {
    private Long id;
    private String country;
    private String state;
    private String city;
    private String street;
    private String mobileNumber;
    private String addressType;
}
