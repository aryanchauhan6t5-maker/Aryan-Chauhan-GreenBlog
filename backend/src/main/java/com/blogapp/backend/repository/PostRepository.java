package com.blogapp.backend.repository;
import com.blogapp.backend.repository.PostRepository;

import com.blogapp.backend.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {

}