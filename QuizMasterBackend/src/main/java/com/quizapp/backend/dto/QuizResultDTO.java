package com.quizapp.backend.dto;

import java.util.List;

public class QuizResultDTO {

    private int score;
    private int totalQuestions;
    private List<AnswerReviewDTO> review;

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public List<AnswerReviewDTO> getReview() {
        return review;
    }

    public void setReview(List<AnswerReviewDTO> review) {
        this.review = review;
    }
}