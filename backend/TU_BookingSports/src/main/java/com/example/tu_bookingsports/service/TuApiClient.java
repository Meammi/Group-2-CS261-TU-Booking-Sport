package com.example.tu_bookingsports.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Service
public class TuApiClient {
    private final RestTemplate restTemplate;

    @Value("${tuapi.base-url:https://restapi.tu.ac.th/api/v1/auth/Ad}")
    private String baseUrl;

    @Value("${tuapi.application-key:}")
    private String applicationKey;

    @Value("${tuapi.insecure:false}")
    private boolean insecure;

    public TuApiClient(RestTemplateBuilder builder) {
        this.restTemplate = builder
                .setConnectTimeout(Duration.ofSeconds(10))
                .setReadTimeout(Duration.ofSeconds(15))
                .build();
    }

    public TuApiVerifyResponse verify(String username, String password) {
        RestTemplate rt = this.restTemplate;
        // Optional: dev-only SSL bypass using JDK HttpClient factory
        if (insecure) {
            try {
                javax.net.ssl.TrustManager[] trustAll = new javax.net.ssl.TrustManager[]{
                        new javax.net.ssl.X509TrustManager() {
                            public java.security.cert.X509Certificate[] getAcceptedIssuers() { return new java.security.cert.X509Certificate[0]; }
                            public void checkClientTrusted(java.security.cert.X509Certificate[] certs, String authType) {}
                            public void checkServerTrusted(java.security.cert.X509Certificate[] certs, String authType) {}
                        }
                };
                javax.net.ssl.SSLContext sc = javax.net.ssl.SSLContext.getInstance("TLS");
                sc.init(null, trustAll, new java.security.SecureRandom());

                java.net.http.HttpClient client = java.net.http.HttpClient.newBuilder()
                        .sslContext(sc)
                        .connectTimeout(Duration.ofSeconds(10))
                        .build();

                org.springframework.http.client.JdkClientHttpRequestFactory factory =
                        new org.springframework.http.client.JdkClientHttpRequestFactory(client);
                rt = new RestTemplate(factory);
            } catch (Exception ignored) { }
        }
        String url = baseUrl + "/verify";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Application-Key", applicationKey);

        Map<String, String> body = new HashMap<>();
        body.put("UserName", username);
        body.put("PassWord", password);

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<TuApiVerifyResponse> response = rt.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    TuApiVerifyResponse.class
            );
            return response.getBody();
        } catch (HttpClientErrorException ex) {
            TuApiVerifyResponse r = new TuApiVerifyResponse();
            r.setStatus(false);
            r.setMessage(ex.getStatusCode() + ": " + ex.getResponseBodyAsString());
            return r;
        }
    }
}
