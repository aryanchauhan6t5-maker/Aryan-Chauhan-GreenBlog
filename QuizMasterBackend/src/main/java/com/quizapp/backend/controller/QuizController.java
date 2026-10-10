package com.quizapp.backend.controller;

import com.quizapp.backend.model.Question;
import com.quizapp.backend.service.QuestionService;
import com.quizapp.backend.dto.AnswerRequestDTO;
import com.quizapp.backend.dto.AnswerResponseDTO;
import com.quizapp.backend.dto.QuizQuestionDTO;
import com.quizapp.backend.dto.QuizResultDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class QuizController {

    private final QuestionService questionService;

    public QuizController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping("/questions")
    public ResponseEntity<List<QuizQuestionDTO>> getQuizQuestions() {
        return ResponseEntity.ok(questionService.getQuizQuestions());
    }

    @GetMapping("/admin/questions")
    public ResponseEntity<List<Question>> getAllQuestions() {
        return ResponseEntity.ok(questionService.getAllQuestions());
    }

    @PostMapping("/questions")
    public ResponseEntity<Question> addQuestion(
            @RequestBody Question question) {
        return ResponseEntity.ok(questionService.addQuestion(question));
    }

    @PostMapping("/questions/check")
    public ResponseEntity<AnswerResponseDTO> checkAnswer(
            @RequestBody AnswerRequestDTO request) {
        return ResponseEntity.ok(questionService.checkAnswer(request));
    }

    @PostMapping("/quiz/submit")
    public ResponseEntity<QuizResultDTO> submitQuiz(
            @RequestBody List<AnswerRequestDTO> answers) {
        return ResponseEntity.ok(questionService.calculateScore(answers));
    }
}