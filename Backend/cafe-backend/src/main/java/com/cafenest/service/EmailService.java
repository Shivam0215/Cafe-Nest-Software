package com.cafenest.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;


@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String toEmail, String token) {
    try {
        String subject = "Verify your email";
        String url = "https://www.cafenest.shop/api/users/verify?token=" + token;
        String text = "Click the following link to verify your email:\n" + url;

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom("no-reply@cafenest.shop");
        msg.setTo(toEmail);
        msg.setSubject(subject);
        msg.setText(text);

        mailSender.send(msg);
        System.out.println("Verification email sent to " + toEmail);
    } catch (Exception e) {
        System.err.println("Failed to send verification email to " + toEmail + ": " + e.getMessage());
    }
}

    
}
