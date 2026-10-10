package com.blogapp.backend.controller;

import com.blogapp.backend.model.Comment;
import com.blogapp.backend.repository.CommentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:5173")
public class CommentController {

    private final CommentRepository commentRepository;

    public CommentController(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    @PostMapping
    public Comment createComment(@RequestBody Comment comment) {

        return commentRepository.save(comment);
    }

    @GetMapping("/post/{postId}")
    public List<Comment> getCommentsByPost(
            @PathVariable Long postId
    ) {

        return commentRepository.findByPostId(postId);
    }

    @DeleteMapping("/{id}")
    public String deleteComment(
            @PathVariable Long id,
            @RequestParam String email
    ) {

        Comment existingComment =
                commentRepository.findById(id)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Comment not found"
                                )
                        );

        if (existingComment.getAuthorEmail() == null ||
                !existingComment.getAuthorEmail().equals(email)) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only delete your own comment"
            );
        }

        commentRepository.deleteById(id);

        return "Comment deleted successfully";
    }
}