package com.nguyenquocviet.recommendationservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nguyenquocviet.recommendationservice.model.Recommendation;
import com.nguyenquocviet.recommendationservice.repository.RecommendationRepository;

import java.util.List;

@Service
public class RecommendationServiceImpl implements RecommendationService {

    @Autowired
    private RecommendationRepository recommendationRepository;

    @Override
    public Recommendation saveRecommendation(Recommendation recommendation) {
        return recommendationRepository.save(recommendation);
    }

    @Override
    public List<Recommendation> getAllRecommendationByProductName(String productName) {
        return recommendationRepository.findAllRatingByProductName(productName);
    }

    @Override
    public void deleteRecommendation(Long id) {
        recommendationRepository.deleteById(id);
    }

	@Override
	public Recommendation getRecommendationById(Long recommendationId) {
		return recommendationRepository.findById(recommendationId).orElse(null);
	}
}
