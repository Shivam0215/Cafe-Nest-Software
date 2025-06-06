if (userRepository.findByEmail(user.getEmail()).isPresent()) {
    return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists");
}