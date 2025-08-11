package com.kart.kart_eCommerce.controller;

import com.kart.kart_eCommerce.model.Category;
import com.kart.kart_eCommerce.response.ApiResponse;
import com.kart.kart_eCommerce.service.category.ICategoryService;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.hibernate.grammars.hql.HqlParser.CONFLICT;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/categories")
public class CategoryController {
    private final ICategoryService categoryService;

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllCategories(){
        try {
            List<Category> categories = categoryService.getAllCategories();
            return ResponseEntity.ok(new ApiResponse("Found" , categories));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse("Error" , e.getMessage()));
        }
    }

    @PostMapping("/add")
     public ResponseEntity<ApiResponse> addCategory(@RequestBody Category category){
         try {
             Category theCategory = categoryService.addCategory(category);
             return ResponseEntity.ok(new ApiResponse("Success" , theCategory));
         } catch (EntityExistsException e) {
             return ResponseEntity.status(CONFLICT).body(new ApiResponse("Error" , e.getMessage()));
         }
     }

    @GetMapping("/category/{id}/category")
     public ResponseEntity<ApiResponse> getCategoryById(@PathVariable Long id){
         try {
             Category theCategory = categoryService.findCategoryById(id);
             return ResponseEntity.ok(new ApiResponse("Success" , theCategory));
         } catch (EntityNotFoundException e) {
             return ResponseEntity.status(NOT_FOUND).body(new ApiResponse("Error" , e.getMessage()));
         }
     }


    @GetMapping("/category/{name}/category")
    public ResponseEntity<ApiResponse> getCategoryByName(@PathVariable String name){
        try {
            Category theCategory = categoryService.findCategoryByName(name);
            return ResponseEntity.ok(new ApiResponse("Found" , theCategory));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage() , null));
        }
    }

    @PutMapping("/category/{id}/update")
    public ResponseEntity<ApiResponse> updateCategory(@PathVariable Long id , @RequestBody Category category){
        try {
            Category updatedCategory = categoryService.updateCategory(category, id);
            return ResponseEntity.ok(new ApiResponse("Update success!" , updatedCategory));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage() , null));
        }
    }

    @DeleteMapping("/category/{id}/delete")
    public ResponseEntity<ApiResponse> deleteCategory(@PathVariable Long id){
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.ok(new ApiResponse("Found !" , null));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage() , null));
        }
    }



}
