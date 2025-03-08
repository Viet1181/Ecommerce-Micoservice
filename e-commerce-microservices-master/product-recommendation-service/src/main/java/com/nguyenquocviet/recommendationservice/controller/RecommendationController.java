package com.nguyenquocviet.recommendationservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.nguyenquocviet.recommendationservice.feignClient.ProductClient;
import com.nguyenquocviet.recommendationservice.feignClient.UserClient;
import com.nguyenquocviet.recommendationservice.http.header.HeaderGenerator;
import com.nguyenquocviet.recommendationservice.model.Product;
import com.nguyenquocviet.recommendationservice.model.Recommendation;
import com.nguyenquocviet.recommendationservice.model.User;
import com.nguyenquocviet.recommendationservice.service.RecommendationService;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @Autowired
    private ProductClient productClient;

    @Autowired
    private UserClient userClient;
    
    @Autowired
    private HeaderGenerator headerGenerator;

    @GetMapping(value = "/recommendations")
    private ResponseEntity<List<Recommendation>> getAllRating(@RequestParam("name") String productName){
        List<Recommendation> recommendations = recommendationService.getAllRecommendationByProductName(productName);
        return new ResponseEntity<List<Recommendation>>(
            recommendations,
            headerGenerator.getHeadersForSuccessGetMethod(),
            HttpStatus.OK);
    }
    
    @PostMapping(value = "/{userId}/recommendations/{productId}")
    private ResponseEntity<Recommendation> saveRecommendations(
            @PathVariable ("userId") Long userId,
            @PathVariable ("productId") Long productId,
            @RequestParam ("rating") int rating,
            @RequestParam(value = "comment", required = false) String comment,
            HttpServletRequest request){
    	
    	Product product = productClient.getProductById(productId);
		User user = userClient.getUserById(userId);
    	
		if(product != null && user != null) {
			try {
				Recommendation recommendation = new Recommendation();
				recommendation.setProduct(product);
				recommendation.setUser(user);
				recommendation.setRating(rating);
				recommendation.setComment(comment);
				recommendationService.saveRecommendation(recommendation);
				return new ResponseEntity<Recommendation>(
						recommendation,
						headerGenerator.getHeadersForSuccessPostMethod(request, recommendation.getId()),
						HttpStatus.CREATED);
			}catch (Exception e) {
				e.printStackTrace();
				return new ResponseEntity<Recommendation>(
						headerGenerator.getHeadersForError(),
						HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}
        return new ResponseEntity<Recommendation>(
        		headerGenerator.getHeadersForError(),
        		HttpStatus.BAD_REQUEST);
    }

    @DeleteMapping(value = "/recommendations/{id}")
    private ResponseEntity<Void> deleteRecommendations(@PathVariable("id") Long id){
    	Recommendation recommendation = recommendationService.getRecommendationById(id);
    	if(recommendation != null) {
    		try {
    			recommendationService.deleteRecommendation(id);
    			return new ResponseEntity<Void>(
    					headerGenerator.getHeadersForSuccessGetMethod(),
    					HttpStatus.OK);
    		}catch (Exception e) {
    			e.printStackTrace();
    			return new ResponseEntity<Void>(
    					headerGenerator.getHeadersForError(),
    					HttpStatus.INTERNAL_SERVER_ERROR);	
    		}
    	}
    	return new ResponseEntity<Void>(
    			headerGenerator.getHeadersForError(),
    			HttpStatus.NOT_FOUND);
    }
}
