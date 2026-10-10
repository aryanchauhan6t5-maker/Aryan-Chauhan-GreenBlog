package com.quizapp.backend.service;

import com.quizapp.backend.dto.AnswerReviewDTO;
import java.util.ArrayList;
import com.quizapp.backend.dto.AnswerRequestDTO;
import com.quizapp.backend.dto.AnswerResponseDTO;
import java.util.stream.Collectors;
import com.quizapp.backend.dto.QuizQuestionDTO;
import com.quizapp.backend.model.Question;
import com.quizapp.backend.repository.QuestionRepository;
import org.springframework.stereotype.Service;
import com.quizapp.backend.dto.QuizResultDTO;
import java.util.List;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    public List<QuizQuestionDTO> getQuizQuestions() {

        return questionRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public AnswerResponseDTO checkAnswer(AnswerRequestDTO request) {

        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Question not found"));

        boolean correct = question.getAnswer()
                .equalsIgnoreCase(request.getSelectedAnswer());

        AnswerResponseDTO response = new AnswerResponseDTO();

        response.setCorrect(correct);

        if (correct) {
            response.setMessage("Correct answer!");
        } else {
            response.setMessage("Wrong answer!");
        }

        return response;
    }

    public QuizQuestionDTO convertToDTO(Question question) {

        QuizQuestionDTO dto = new QuizQuestionDTO();

        dto.setId(question.getId());
        dto.setQuestion(question.getQuestion());
        dto.setOptionA(question.getOptionA());
        dto.setOptionB(question.getOptionB());
        dto.setOptionC(question.getOptionC());
        dto.setOptionD(question.getOptionD());

        return dto;
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Question addQuestion(Question question) {
        return questionRepository.save(question);
    }

    public QuizResultDTO calculateScore(List<AnswerRequestDTO> answers) {

        int score = 0;

        List<AnswerReviewDTO> review = new ArrayList<>();

        for (AnswerRequestDTO answer : answers) {

            Question question = questionRepository
                    .findById(answer.getQuestionId())
                    .orElseThrow(() -> new RuntimeException("Question not found"));

            boolean correct = question.getAnswer()
                    .equalsIgnoreCase(answer.getSelectedAnswer());

            if (correct) {
                score++;
            }

            AnswerReviewDTO reviewItem = new AnswerReviewDTO();

            reviewItem.setQuestionId(question.getId());
            reviewItem.setSelectedAnswer(answer.getSelectedAnswer());
            reviewItem.setCorrectAnswer(question.getAnswer());
            reviewItem.setCorrect(correct);

            review.add(reviewItem);
        }

        QuizResultDTO result = new QuizResultDTO();

        result.setScore(score);
        result.setTotalQuestions(answers.size());
        result.setReview(review);

        return result;
    }
}