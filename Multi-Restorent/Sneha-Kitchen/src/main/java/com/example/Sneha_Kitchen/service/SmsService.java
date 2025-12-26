package com.example.Sneha_Kitchen.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

import jakarta.annotation.PostConstruct;

@Service
public class SmsService {

    @Value("${twilio.accountSid}")
    private String accountSid;

    @Value("${twilio.authToken}")
    private String authToken;

    @Value("${twilio.messagingServiceSid}")
    private String messagingServiceSid;

    @PostConstruct
    public void init() {
        Twilio.init(accountSid, authToken);
        System.out.println("Twilio initialized with MessagingServiceSid");
    }

    public void sendSms(String to, String body) {
        try {
            Message.creator(
                    new PhoneNumber(to),
                    messagingServiceSid,    // ✔ Use Messaging Service SID
                    body
            ).create();

            System.out.println("SMS Sent Successfully to " + to);

        } catch (Exception e) {
            System.err.println("SMS Sending Failed: " + e.getMessage());
        }
    }
}













/*package com.example.Sneha_Kitchen.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;

@Service
public class SmsService {

    @Value("${twilio.accountSid}")
    private String accountSid;

    @Value("${twilio.authToken}")
    private String authToken;

    @Value("${twilio.fromNumber}")
    private String fromNumber;

    @jakarta.annotation.PostConstruct
    public void init() {
        if (accountSid != null && authToken != null) {
            Twilio.init(accountSid, authToken);
            System.out.println("Twilio initialized successfully");
        } else {
            System.out.println("Twilio credentials missing!");
        }
    }

    public String sendSms(String to, String body) {
        if (accountSid == null || authToken == null || fromNumber == null) {
            System.out.println("Twilio is not configured properly!");
            return null;
        }

        try {
            Message message = Message.creator(
                    new com.twilio.type.PhoneNumber(to),
                    new com.twilio.type.PhoneNumber(fromNumber),
                    body
            ).create();

            System.out.println("SMS Sent Successfully: " + message.getSid());
            return message.getSid();

        } catch (Exception e) {
            System.err.println("Failed to send SMS: " + e.getMessage());
            return null;
        }
    }
}*/

















