
package com.blogapp.backend.controller;

import com.blogapp.backend.model.Post;
import com.blogapp.backend.repository.PostRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:5173")
public class PostController {

    private final PostRepository postRepository;

    public PostController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    // Create a post using the authenticated user's email
    @PostMapping
    public Post createPost(
            @RequestBody Post post,
            Authentication authentication) {

        post.setAuthorEmail(authentication.getName());
        return postRepository.save(post);
    }

    // View all posts
    @GetMapping
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // Edit only your own post
    @PutMapping("/{id}")
    public Post updatePost(
            @PathVariable Long id,
            @RequestBody Post updatedPost,
            Authentication authentication) {

        Post existingPost = postRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Post not found"));

        if (existingPost.getAuthorEmail() == null
                || !existingPost.getAuthorEmail()
                .equals(authentication.getName())) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only edit your own post");
        }

        existingPost.setTitle(updatedPost.getTitle());
        existingPost.setContent(updatedPost.getContent());

        return postRepository.save(existingPost);
    }

    // Delete only your own post
    @DeleteMapping("/{id}")
    public String deletePost(
            @PathVariable Long id,
            Authentication authentication) {

        Post existingPost = postRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Post not found"));

        if (existingPost.getAuthorEmail() == null
                || !existingPost.getAuthorEmail()
                .equals(authentication.getName())) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only delete your own post");
        }

        postRepository.delete(existingPost);
        return "Post deleted successfully";
    }
}
