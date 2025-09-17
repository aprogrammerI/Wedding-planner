//package com.yourcompany.wedding.weddingbackend.web;
//
//import com.yourcompany.wedding.weddingbackend.dto.BudgetCategoryDTO;
//import com.yourcompany.wedding.weddingbackend.dto.BudgetDTO;
//import com.yourcompany.wedding.weddingbackend.dto.BudgetItemDTO;
//import com.yourcompany.wedding.weddingbackend.model.CategoryType;
//import com.yourcompany.wedding.weddingbackend.service.BudgetService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/budget")
//@CrossOrigin
//@RequiredArgsConstructor
//public class BudgetController {
//
//    private final BudgetService budgetService;
//
//    @GetMapping
//    public ResponseEntity<BudgetDTO> getBudget(@RequestHeader("X-User-Id") Long userId) {
//        return ResponseEntity.ok(budgetService.getBudget(userId));
//    }
//
//    @PutMapping
//    public ResponseEntity<BudgetDTO> createOrUpdateBudget(@RequestHeader("X-User-Id") Long userId, @RequestBody BudgetDTO budgetDto) {
//        try {
//            BudgetDTO savedBudget = budgetService.createOrUpdateBudget(userId, budgetDto);
//            return ResponseEntity.ok(savedBudget);
//        } catch (RuntimeException ex) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        }
//    }
//
//    @PostMapping("/items")
//    public ResponseEntity<BudgetItemDTO> addBudgetItem(@RequestHeader("X-User-Id") Long userId, @RequestBody BudgetItemDTO budgetItemDto) {
//        try {
//            BudgetItemDTO newItem = budgetService.addBudgetItem(userId, budgetItemDto);
//            return ResponseEntity.status(HttpStatus.CREATED).body(newItem);
//        } catch (RuntimeException ex) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
//        }
//    }
//
//    @PutMapping("/items/{itemId}")
//    public ResponseEntity<BudgetItemDTO> updateBudgetItem(@RequestHeader("X-User-Id") Long userId, @PathVariable Long itemId, @RequestBody BudgetItemDTO updatedItemDto) {
//        try {
//            BudgetItemDTO updatedItem = budgetService.updateBudgetItem(userId, itemId, updatedItemDto);
//            return ResponseEntity.ok(updatedItem);
//        } catch (RuntimeException ex) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//        }
//    }
//
//    @DeleteMapping("/items/{itemId}")
//    public ResponseEntity<Void> deleteBudgetItem(@RequestHeader("X-User-Id") Long userId, @PathVariable Long itemId) {
//        try {
//            budgetService.deleteBudgetItem(userId, itemId);
//            return ResponseEntity.noContent().build();
//        } catch (RuntimeException ex) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//        }
//    }
//
//    @PatchMapping("/categories/{categoryType}/limit")
//    public ResponseEntity<BudgetCategoryDTO> updateBudgetCategoryLimit(@RequestHeader("X-User-Id") Long userId, @PathVariable CategoryType categoryType, @RequestParam double newLimit) {
//        try {
//            BudgetCategoryDTO updatedCategory = budgetService.updateBudgetCategoryLimit(userId, categoryType, newLimit);
//            return ResponseEntity.ok(updatedCategory);
//        } catch (RuntimeException ex) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
//        }
//    }
//}


package com.yourcompany.wedding.weddingbackend.web;

import com.yourcompany.wedding.weddingbackend.dto.BudgetCategoryDTO;
import com.yourcompany.wedding.weddingbackend.dto.BudgetDTO;
import com.yourcompany.wedding.weddingbackend.dto.BudgetItemDTO;
import com.yourcompany.wedding.weddingbackend.model.CategoryType;
import com.yourcompany.wedding.weddingbackend.service.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/budget")
@CrossOrigin
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @GetMapping
    public ResponseEntity<BudgetDTO> getBudget(@RequestHeader("X-User-Id") Long userId) {
        System.out.println("[BudgetController] GET /api/budget userId=" + userId);
        return ResponseEntity.ok(budgetService.getBudget(userId));
    }

    @PutMapping
    public ResponseEntity<BudgetDTO> createOrUpdateBudget(@RequestHeader("X-User-Id") Long userId,
                                                          @RequestBody BudgetDTO budgetDto) {
        System.out.println("[BudgetController] PUT /api/budget userId=" + userId + " body=" + budgetDto);
        try {
            BudgetDTO savedBudget = budgetService.createOrUpdateBudget(userId, budgetDto);
            return ResponseEntity.ok(savedBudget);
        } catch (RuntimeException ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/items")
    public ResponseEntity<BudgetItemDTO> addBudgetItem(@RequestHeader("X-User-Id") Long userId,
                                                       @RequestBody BudgetItemDTO budgetItemDto) {
        System.out.println("[BudgetController] POST /api/budget/items userId=" + userId + " body=" + budgetItemDto);
        try {
            BudgetItemDTO newItem = budgetService.addBudgetItem(userId, budgetItemDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(newItem);
        } catch (RuntimeException ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<BudgetItemDTO> updateBudgetItem(@RequestHeader("X-User-Id") Long userId,
                                                          @PathVariable Long itemId,
                                                          @RequestBody BudgetItemDTO updatedItemDto) {
        System.out.println("[BudgetController] PUT /api/budget/items/" + itemId + " userId=" + userId + " body=" + updatedItemDto);
        try {
            BudgetItemDTO updatedItem = budgetService.updateBudgetItem(userId, itemId, updatedItemDto);
            return ResponseEntity.ok(updatedItem);
        } catch (RuntimeException ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> deleteBudgetItem(@RequestHeader("X-User-Id") Long userId,
                                                 @PathVariable Long itemId) {
        System.out.println("[BudgetController] DELETE /api/budget/items/" + itemId + " userId=" + userId);
        try {
            budgetService.deleteBudgetItem(userId, itemId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PatchMapping("/categories/{categoryType}/limit")
    public ResponseEntity<BudgetCategoryDTO> updateBudgetCategoryLimit(@RequestHeader("X-User-Id") Long userId,
                                                                       @PathVariable CategoryType categoryType,
                                                                       @RequestParam double newLimit) {
        System.out.println("[BudgetController] PATCH /api/budget/categories/" + categoryType + "/limit userId=" + userId + " newLimit=" + newLimit);
        try {
            BudgetCategoryDTO updatedCategory = budgetService.updateBudgetCategoryLimit(userId, categoryType, newLimit);
            return ResponseEntity.ok(updatedCategory);
        } catch (RuntimeException ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}