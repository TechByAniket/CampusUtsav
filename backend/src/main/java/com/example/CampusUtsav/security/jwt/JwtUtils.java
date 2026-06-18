package com.example.CampusUtsav.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
//@AllArgsConstructor
public class JwtUtils {

    @Value("${app.jwtSecret}")
    private String jwtSecret;

    @Value("${app.jwtExpirationMs}")
    private long jwtExpirationMs;

    // Generate JWT Token
    public String generateJwtToken(String username, String role, Integer collegeId, Integer profileId){
        return Jwts.builder()
                .setSubject(username)
                .claim("role",role)
                .claim("collegeId", collegeId)
                .claim("profileId", profileId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    // Get username(email for our use case) from token
    public String getUsernameFromJwtToken(String token){
        return Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public Integer getProfileIdFromJwtToken(String token){
        return Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody()
                .get("profileId", Integer.class);
    }

    // Get collegeId from JWT token
    public Integer getCollegeIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();

        return claims.get("collegeId", Integer.class);
    }

    // Validate the JWT Token
    public boolean validateJwtToken(String authToken){
        try{
            Jwts.parser()
                    .setSigningKey(jwtSecret)
                    .parseClaimsJws(authToken);

            return true;
        } catch(JwtException | IllegalArgumentException e){
            e.printStackTrace();
        }
        return false;
    }

    // Getting role from JWT Token
    public String getRoleFromJwtToken(String token){
        return Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }
}
