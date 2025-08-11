package com.kart.SuperKart.service.address;

import com.kart.SuperKart.dtos.AddressDto;
import com.kart.SuperKart.model.Address;
import com.kart.SuperKart.repository.AddressRepository;
import com.kart.SuperKart.service.user.IUserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AddressService implements IAddressService {
    private final AddressRepository addressRepository;
    private final IUserService userService;
    private final ModelMapper modelMapper;


    @Override
    public List<Address> createAddress(List<Address> addressList, Long userId) {
        return Optional.ofNullable(userService.getUserById(userId))
                .map(user -> addressList.stream()
                        .peek(address -> address.setUser(user))
                        .toList())
                .map(addressRepository::saveAll)
                .orElse(Collections.emptyList());
    }

    @Override
    public List<Address> getUserAddresses(Long userId) {
        return addressRepository.findByUserId(userId);
    }

    @Override
    public Address getAddressById(Long addressId) {
        return addressRepository.findById(addressId)
                .orElseThrow(() -> new EntityNotFoundException("Address not found!"));
    }

    @Override
    public void deleteAddress(Long addressId) {
        addressRepository.findById(addressId).ifPresentOrElse(addressRepository::delete, () -> {
            throw new EntityNotFoundException("Address not found!");
        });
    }

    @Override
    public Address updateAddress(Long id, Address address) {
        return addressRepository.findById(id).map(existingAddress -> {
            existingAddress.setCountry(address.getCountry());
            existingAddress.setState(address.getState());
            existingAddress.setCity(address.getCity());
            existingAddress.setStreet(address.getStreet());
            existingAddress.setAddressType(address.getAddressType());
            return addressRepository.save(existingAddress);
        }).orElseThrow(() -> new EntityNotFoundException("Address not found!"));
    }

    @Override
    public List<AddressDto> convertToDto(List<Address> addressList) {
        return addressList.stream().map(this::convertToDto).toList();

    }

    @Override
    public AddressDto convertToDto(Address address) {
        return modelMapper.map(address, AddressDto.class);
    }
}


