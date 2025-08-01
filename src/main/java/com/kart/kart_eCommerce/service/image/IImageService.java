package com.kart.kart_eCommerce.service.image;

import com.kart.kart_eCommerce.dtos.ImageDto;
import com.kart.kart_eCommerce.model.Image;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IImageService {
    Image getImageById(Long imageId);
    void deleteImageById(Long imageId);
    void updateImage(MultipartFile file, Long imageId);
    List<ImageDto> saveImages(Long productId, List<MultipartFile> files);

}