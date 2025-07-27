package com.kart.kart_eCommerce.service.category;

import com.kart.kart_eCommerce.model.Category;

import java.util.List;

public interface ICategoryService {
    Category addCategory(Category category);
    Category updateCategory(Category category , Long categoryId);
    void deleteCategory(Long categoryId);
    List<Category> getAllCategories();
    Category findCategoryByName(String name);
    Category findCategoryById(Long categoryId);



}
