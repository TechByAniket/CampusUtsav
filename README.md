# CampusUtsav Backend

![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.7-brightgreen?style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791?style=flat-square)
![Maven](https://img.shields.io/badge/Maven-Build-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

A **production-grade event management platform** designed to centralize college event communication, streamline approval workflows, and empower role-based access control across multi-tier organizational hierarchies.

---

## 📋 Table of Contents

- [Problem Statement](#problem-statement)
- [Solution Overview](#solution-overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Authentication & Authorization](#authentication--authorization)
- [Database Design](#database-design)
- [API Overview](#api-overview)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Deployed Links](#deployed-links)
- [Security Features](#security-features)
- [Learning Outcomes](#learning-outcomes)
- [Future Enhancements](#future-enhancements)

---

## 🎯 Problem Statement

Colleges face **scattered event communication and fragmented approval workflows**:

- ❌ Event announcements dispersed across multiple channels (WhatsApp, Email, Notice Boards)
- ❌ Inconsistent approval processes with unclear authorization chains
- ❌ Difficulty tracking event registrations, attendance, and participation metrics
- ❌ Limited coordination between clubs, departments, and administration
- ❌ Manual tracking of team formations and participant management
- ❌ No unified dashboard for administrators to monitor institutional activity

**CampusUtsav solves these challenges** by providing a centralized, role-based platform with structured workflows and real-time notifications.

---

## ✨ Solution Overview

CampusUtsav is a **multi-role, hierarchical event management system** that:

✅ Centralizes event creation, approval, and dissemination  
✅ Enforces structured approval workflows across organizational levels  
✅ Provides role-based dashboards tailored to different stakeholders  
✅ Supports both individual and team-based event registrations  
✅ Manages club administration and inter-departmental coordination  
✅ Delivers real-time notifications and event analytics  
✅ Integrates AI-powered event description generation (via Gemini API)  

**Why colleges need this:**
- Reduces administrative overhead and manual coordination
- Ensures compliance and standardized approval processes
- Improves student engagement through better event visibility
- Provides institutional-level insights through analytics

---

## 🚀 Key Features

### 1. **Multi-Role Authentication & Authorization**
- Role-based access control (RBAC) with 5 distinct roles
- JWT-based stateless authentication
- Secure password hashing using BCrypt
- Role-specific dashboards and permissions

### 2. **Event Management**
- Event creation with rich metadata (category, type, venue, timing)
- Structured approval workflows with audit trails
- Individual and team-based event registrations
- Dynamic team member management (add/remove/leave)
- Event resubmission workflow for rejected events
- Registration deadline enforcement

### 3. **Event Approval Workflow**
- Multi-level approval chain (Club Admin → HOD → Principal)
- Event status tracking (PENDING, APPROVED, REJECTED, etc.)
- Approval history and audit logs
- Role-aware approval interfaces

### 4. **Club Management**
- Club registration and profile management
- Club coordinator assignment
- Club-specific event management
- Club-level analytics

### 5. **Student Engagement**
- Student registration with profile management
- Event registration (individual or team-based)
- Team formation and leadership
- Registration history and attendance tracking
- Personal dashboard with upcoming events

### 6. **Institutional Administration**
- College-level event analytics
- Department (HOD) event oversight
- Student and staff management
- Approval workflow configuration

### 7. **Announcements & Notifications**
- Real-time event notifications
- Approval status updates
- Team-related notifications
- Unread notification tracking

### 8. **Event Analytics & Reporting**
- Event-wise participant count
- Team registration analytics
- Club-level performance metrics
- Institutional-level event statistics

### 9. **AI-Powered Content Generation**
- AI-generated event descriptions using Google Gemini API
- Markdown-formatted event content
- Professional event description templates

---

## 🏗️ System Architecture

CampusUtsav follows a **layered, microservice-ready architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    REST API Controllers                      │
│  (Request handling, input validation, response formatting)   │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                  Service Layer (Business Logic)              │
│  (EventService, ClubService, StudentService, etc.)          │
│  (Transaction management, authorization checks)             │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│           Repository Layer (Data Access Objects)             │
│  (EventRepository, ClubRepository, StudentRepository, etc.)  │
│  (Custom JPQL queries, database optimization)               │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│         Entity Layer (Domain Models & Persistence)           │
│  (User, Student, Staff, Event, Club, Team, etc.)            │
│  (JPA mapping, relationships, validations)                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                   PostgreSQL Database                        │
│  (Relational storage with JSONB support for attachments)    │
└─────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

| Layer | Responsibility |
|-------|---|
| **Controllers** | Handle HTTP requests, route to services, format responses |
| **Services** | Business logic, transaction coordination, authorization, notifications |
| **Repositories** | Database abstraction, JPQL queries, optimization hints (EntityGraph) |
| **Entities** | Domain models, JPA mappings, validation rules, lifecycle callbacks |
| **DTOs** | Request/response payloads, data transfer, API contracts |
| **Security Layer** | JWT generation/validation, authentication filters, role enforcement |
| **Config Layer** | Spring configuration, bean definitions, external service clients |

---

## 🔐 Authentication & Authorization

### JWT-Based Authentication Flow

```
User Login (email + password)
         ↓
PasswordEncoder.matches() → Password Validation
         ↓
JwtUtils.generateJwtToken() → JWT Creation with claims
         ↓
Return { token, role, email, collegeId, profileId }
         ↓
Client stores JWT and sends in Authorization header
         ↓
JwtAuthenticationFilter intercepts requests
         ↓
Validates token → Extracts claims → Creates Authentication context
```

### JWT Token Structure

```json
{
  "sub": "user@example.com",
  "role": "ROLE_STUDENT",
  "collegeId": 1001,
  "profileId": 42,
  "iat": 1234567890,
  "exp": 1234571490
}
```

### Role-Based Access Control (RBAC)

| Role | Permissions |
|------|---|
| **STUDENT** | Register for events, join teams, view registrations, receive notifications |
| **CLUB_ADMIN** | Create/edit events, submit for approval, view registrations, manage members |
| **HOD** | Approve events for department, view branch-level analytics |
| **FACULTY** | Manage assigned club, review event approvals, coordinator duties |
| **PRINCIPAL** | View institutional analytics, final approval authority |

### Authorization Implementation

- **Method-level Security**: `@AuthenticationPrincipal CustomUserDetails` injects authenticated user
- **Custom Validators**: `ValidationHelperService` checks ownership and permissions
- **AccessDeniedException**: Thrown for unauthorized access attempts
- **Audit Logging**: `EventLog` tracks all approval state changes

---

## 🗄️ Database Design

### Entity Relationship Diagram (Conceptual)

```
┌─────────────┐        ┌────────────┐
│   User      │──┬─────│  Student   │
│             │  │     │            │
└─────────────┘  │     └────┬───────┘
                 │          │
            ┌────┴──────┐   │
            │           │   │
        ┌─────────┐  ┌──────────┐
        │ College │  │EventRegis│
        └────┬────┘  │tration   │
             │       └──────────┘
        ┌────┴──────┐
        │           │
    ┌───────┐   ┌────┴──┐
    │ Staff │   │ Club  │
    └───────┘   │       │
                └───┬───┘
                    │
                ┌───────────────┐
                │     Event     │
                ├───────────────┤
                │ - title       │
                │ - status      │
                │ - approval    │
                │ - venue       │
                └───┬───────────┘
                    │
            ┌───────┴────────┐
            │                │
        ┌───────┐        ┌───────┐
        │ Team  │        │EventLog│
        └───┬───┘        └────────┘
            │
        ┌───────────┐
        │TeamMember │
        └────────────┘
```

### Core Entities

| Entity | Purpose |
|--------|---------|
| **User** | Authentication credentials, role assignment |
| **Student** | College-level student profile with branch/year info |
| **Staff** | Faculty/HOD profile with designation and club assignment |
| **College** | Institutional profile with branches and domains |
| **Club** | Student organization with coordinator assignment |
| **Event** | Event details with approval workflow state |
| **EventRegistration** | Individual or team registration for events |
| **Team** | Group of students registering as a team |
| **TeamMember** | Individual team participant with status |
| **EventLog** | Audit trail for approval workflow changes |
| **Notification** | Real-time notifications for users |
| **EventAttendance** | Attendance tracking for participants |

### Database Optimizations

- **EntityGraph Loading**: Prevents N+1 query problems
- **Composite Indexes**: On approval workflow queries
- **JSONB Storage**: Event attachments as JSON for flexibility
- **Unique Constraints**: Prevent duplicate event registrations

---

## 📡 API Overview

### Authentication Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| `POST` | `/api/auth/login` | ❌ | User login with JWT generation |
| `GET` | `/api/auth/roles` | ❌ | List available roles |
| `GET` | `/api/auth/account-statuses` | ❌ | List account statuses |

### Event Management Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| `POST` | `/api/events/{clubId}/new-event` | ✅ | Create new event |
| `PUT` | `/api/events/{eventId}/resubmit` | ✅ | Resubmit rejected event |
| `GET` | `/api/colleges/{collegeId}/events` | ✅ | List events by college |
| `GET` | `/api/events/{eventId}` | ✅ | Event details |
| `GET` | `/api/clubs/{clubId}/events` | ✅ | Events by club |
| `POST` | `/api/events/ai/generate` | ✅ | Generate event description (AI) |

### Event Registration Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| `POST` | `/api/events/{eventId}/register` | ✅ | Register for event (individual/team) |
| `PATCH` | `/api/registrations/{registrationId}/cancel` | ✅ | Cancel registration |

### Team Management Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| `PATCH` | `/api/teams/{teamId}/add-member/{studentId}` | ✅ | Add team member |
| `GET` | `/api/teams/{teamId}/members` | ✅ | Get team members |
| `PATCH` | `/api/team-members/{teamMemberId}/leave` | ✅ | Member leave team |
| `PATCH` | `/api/team-members/{teamMemberId}/remove` | ✅ | Remove team member |

### Student Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| `POST` | `/api/student/register` | ❌ | Student registration |
| `GET` | `/api/students/me` | ✅ | Student profile |
| `GET` | `/api/me/registrations` | ✅ | My registrations |
| `GET` | `/api/colleges/{collegeId}/students` | ✅ | List students by college |

### Club Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| `GET` | `/api/public/colleges/{collegeId}/branches` | ❌ | Available branches |
| `GET` | `/api/public/colleges` | ❌ | List all colleges |
| `GET` | `/api/college/me` | ✅ | College profile |

### Staff Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| `POST` | `/api/public/staff/register` | ❌ | Staff registration |
| `GET` | `/api/admin/staff` | ✅ | List staff by college |
| `PATCH` | `/api/admin/staff/{staffId}/status` | ✅ | Update staff status |
| `PATCH` | `/api/admin/staff/{staffId}/role` | ✅ | Update staff role |
| `PATCH` | `/api/admin/staff/{staffId}/club` | ✅ | Assign club coordinator |
| `GET` | `/api/staff/me` | ✅ | Staff profile |

### Notification Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| `GET` | `/api/notifications` | ✅ | Get all notifications |
| `GET` | `/api/notifications/unread-count` | ✅ | Unread notification count |
| `PUT` | `/api/notifications/{notificationId}/read` | ✅ | Mark notification as read |
| `PUT` | `/api/notifications/read-all` | ✅ | Mark all as read |

### Metadata Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| `GET` | `/api/public/meta/registrations` | ❌ | Registration statuses |
| `GET` | `/api/public/meta/teams` | ❌ | Team statuses and member statuses |
| `GET` | `/api/public/meta/staff-designations` | ❌ | Staff designations |
| `GET` | `/api/public/meta/branches` | ❌ | Available branches |

### Health & Utility Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| `GET` | `/api/public/health` | ❌ | Service health check |

---

## 📁 Project Structure

```
CampusUtsav-Backend/
│
├── pom.xml                                  # Maven dependencies & build config
│
├── src/main/java/com/example/CampusUtsav/
│   ├── config/                              # Spring configuration beans
│   │   ├── SecurityConfig.java              # JWT + CORS + Auth chain
│   │   ├── GeminiConfig.java                # Google Gemini AI client
│   │   └── SupabaseConfig.java              # Supabase storage client
│   │
│   ├── controller/                          # REST API endpoints
│   │   ├── AuthController.java              # Login & role management
│   │   ├── EventController.java             # Event CRUD & workflows
│   │   ├── StudentController.java           # Student registration & profile
│   │   ├── StaffController.java             # Staff management
│   │   ├── CollegeController.java           # College profile & registration
│   │   ├── EventRegistrationController.java # Event registration
│   │   ├── TeamController.java              # Team operations
│   │   ├── TeamMemberController.java        # Team member management
│   │   ├── NotificationController.java      # Notification retrieval
│   │   ├── MetaController.java              # Enum metadata
│   │   └── HealthController.java            # Service health check
│   │
│   ├── service/                             # Business logic interfaces
│   │   ├── EventService.java
│   │   ├── StudentService.java
│   │   ├── ClubService.java
│   │   ├── StaffService.java
│   │   ├── CollegeService.java
│   │   ├── EventRegistrationService.java
│   │   ├── TeamService.java
│   │   ├── TeamMemberService.java
│   │   ├── NotificationService.java
│   │   ├── AuthService.java
│   │   ├── AiService.java
│   │   └── SupabaseService.java
│   │
│   ├── serviceImpl/                          # Service implementations
│   │   ├── EventServiceImpl.java
│   │   ├── StudentServiceImpl.java
│   │   ├── ClubServiceImpl.java
│   │   ├── StaffServiceImpl.java
│   │   ├── CollegeServiceImpl.java
│   │   ├── EventRegistrationServiceImpl.java
│   │   ├── TeamServiceImpl.java
│   │   ├── TeamMemberServiceImpl.java
│   │   ├── NotificationServiceImpl.java
│   │   ├── AuthServiceImpl.java
│   │   └── helper/                          # Helper utilities
│   │       ├── ValidationHelperService.java # Authorization checks
│   │       └── EntityLookupService.java     # Safe entity retrieval
│   │
│   ├── repository/                          # Data access layer (JPA)
│   │   ├── EventRepository.java
│   │   ├── StudentRepository.java
│   │   ├── ClubRepository.java
│   │   ├── StaffRepository.java
│   │   ├── CollegeRepository.java
│   │   ├── EventRegistrationRepository.java
│   │   ├── TeamRepository.java
│   │   ├── TeamMemberRepository.java
│   │   ├── NotificationRepository.java
│   │   ├── EventLogRepository.java
│   │   ├── UserRepository.java
│   │   ├── BranchRepository.java
│   │   └── EventAttendanceRepository.java
│   │
│   ├── entity/                              # JPA domain entities
│   │   ├── User.java                        # Authentication entity
│   │   ├── Student.java
│   │   ├── Staff.java
│   │   ├── College.java
│   │   ├── Branch.java
│   │   ├── Club.java
│   │   ├── Event.java                       # Core event entity
│   │   ├── EventRegistration.java
│   │   ├── EventLog.java                    # Audit trail
│   │   ├── EventAttendance.java
│   │   ├── Team.java
│   │   ├── TeamMember.java
│   │   ├── Notification.java
│   │   └── enums/
│   │       ├── Role.java                    # STUDENT, CLUB_ADMIN, HOD, FACULTY, PRINCIPAL
│   │       ├── EventStatus.java             # PENDING, APPROVED, REJECTED, etc.
│   │       ├── EventType.java               # WORKSHOP, HACKATHON, SEMINAR, etc.
│   │       ├── EventCategory.java
│   │       ├── RegistrationStatus.java
│   │       ├── TeamStatus.java
│   │       ├── TeamMemberStatus.java
│   │       ├── AccountStatus.java           # ACTIVE, PENDING, SUSPENDED
│   │       ├── NotificationType.java
│   │       ├── Designation.java             # HOD, COORDINATOR, FACULTY
│   │       └── ...
│   │
│   ├── dtos/                                # Data Transfer Objects
│   │   ├── LoginRequest.java
│   │   ├── LoginResponse.java
│   │   ├── EventRequest.java                # Event creation payload
│   │   ├── EventResponse.java               # Event response DTO
│   │   ├── StudentRegistrationRequest.java
│   │   ├── StudentResponse.java
│   │   ├── StaffRegistrationRequest.java
│   │   ├── StaffResponse.java
│   │   ├── CollegeRegistrationRequest.java
│   │   ├── CollegeResponse.java
│   │   ├── EventRegistrationRequest.java
│   │   ├── EventRegistrationResponse.java
│   │   ├── NotificationResponse.java
│   │   └── miniDtos/                        # Lightweight DTOs for lists
│   │       ├── EventSummary.java
│   │       ├── StudentSummary.java
│   │       ├── CollegeSummary.java
│   │       ├── ClubSummary.java
│   │       ├── TeamMemberSummary.java
│   │       └── ...
│   │
│   ├── mapper/                              # Entity <-> DTO conversion
│   │   ├── EventMapper.java
│   │   ├── StudentMapper.java
│   │   ├── EventLogMapper.java
│   │   ├── ClubMapper.java
│   │   └── ...
│   │
│   ├── security/                            # Authentication & authorization
│   │   ├── jwt/
│   │   │   └── JwtUtils.java                # JWT token generation/validation
│   │   │   └── JwtAuthenticationFilter.java # JWT filter chain
│   │   ├── service/
│   │   │   └── CustomUserDetailsService.java
│   │   ├── model/
│   │   │   └── CustomUserDetails.java       # Enhanced user details
│   │   └── utils/
│   │       └── PasswordEncoderConfig.java
│   │
│   ├── ai/                                  # AI integrations
│   │   ├── AiService.java                   # AI service interface
│   │   ├── AiServiceImpl.java                # AI implementation
│   │   └── GeminiClientService.java         # Gemini API client
│   │
│   ├── utils/                               # Utility classes
│   │   ├── EventUtils.java
│   │   ├── ClubUtils.java
│   │   ├── StudentUtils.java
│   │   ├── NotificationUtils.java
│   │   └── JsonToMapConverter.java          # JSON/JSONB converter
│   │
│   └── CampusUtsavApplication.java          # Spring Boot main class
│
├── src/main/resources/
│   ├── application.properties               # Configuration properties
│   └── application-prod.properties          # Production config
│
└── src/test/
    └── java/...                             # Unit & integration tests
```

---

## 🛠️ Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Runtime** | Java | 21 |
| **Framework** | Spring Boot | 3.5.7 |
| **Build Tool** | Maven | Latest |
| **Database** | PostgreSQL | Latest |
| **ORM** | JPA/Hibernate | Latest |
| **Security** | Spring Security + JWT | 0.11.5 (JJWT) |
| **Authentication** | BCrypt | Latest |
| **File Storage** | Supabase (PostgreSQL + Storage) | Latest |
| **AI Integration** | Google Gemini API | v1beta |
| **WebClient** | Spring WebFlux | Latest |
| **Utilities** | Lombok | 1.18.36 |
| **Validation** | Jakarta Bean Validation | Latest |
| **JSON Processing** | Jackson | Latest |

### Key Dependencies

```xml
<!-- Spring Boot Starters -->
spring-boot-starter-data-jpa
spring-boot-starter-security
spring-boot-starter-web
spring-boot-starter-validation
spring-boot-starter-webflux
spring-boot-starter-mail

<!-- JWT -->
jjwt-api:0.11.5
jjwt-impl:0.11.5
jjwt-jackson:0.11.5

<!-- Database -->
postgresql:42.7.2
hibernate-community-dialects

<!-- Utilities -->
lombok:1.18.36
```

---

## 🚀 Getting Started

### Prerequisites

- Java 21+
- Maven 3.8+
- PostgreSQL 12+
- Git

### Quick Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/TechByAniket/CampusUtsav-Backend.git
   cd CampusUtsav-Backend
   ```

2. **Configure database** in `application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/campusutsav_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. **Add API keys** in `application.properties`:
   ```properties
   app.jwtSecret=your_jwt_secret_key
   gemini.api.key=your_gemini_api_key
   supabase.url=your_supabase_url
   supabase.service.key=your_supabase_key
   ```

4. **Build and run**:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

5. **Verify health**:
   ```bash
   curl http://localhost:8080/api/public/health
   ```

---

## 🌐 Deployed Links

| Platform | Link |
|----------|------|
| **Frontend (Vercel)** | [campusutsav.vercel.app](https://campusutsav.vercel.app) |
| **Backend (Render)** | [campusutsav-backend.onrender.com](https://campusutsav-backend.onrender.com) |

---

## 🔒 Security Features

### 1. Authentication

✅ **JWT-Based Stateless Authentication**
- Tokens valid for 24 hours (configurable)
- Contains encoded user metadata (role, college, profileId)
- Signed with HS512 algorithm

✅ **Password Security**
- BCrypt hashing (strength factor: 10+)
- Passwords never stored in plaintext
- Secure password validation during login

✅ **Email/Phone Verification**
- Verification codes for new registrations
- Domain validation for college official emails
- Two-factor authentication ready (future enhancement)

### 2. Authorization

✅ **Role-Based Access Control (RBAC)**
- Five-tier role hierarchy
- Method-level authorization checks
- Resource-level permission validation

✅ **Custom Authorization Validators**
- `ValidationHelperService` enforces business rules
- Ownership verification (user owns resource)
- College/department isolation
- Club-specific permissions

✅ **Protected Endpoints**
- Public endpoints for registration and login
- All other endpoints require valid JWT
- Role-specific endpoint access

### 3. Data Protection

✅ **CORS Security**
- Configured for localhost and production domains
- Prevents unauthorized cross-origin requests
- Credentials transmission controlled

✅ **CSRF Protection**
- CSRF protection disabled for stateless JWT auth
- Vulnerable only to CSRF on form submissions

✅ **SQL Injection Prevention**
- JPA/Hibernate parameterized queries
- No raw SQL concatenation

✅ **Input Validation**
- Jakarta Bean Validation annotations
- Server-side validation on all inputs
- Email, phone, and URL format validation

### 4. Audit & Logging

✅ **Event Approval Audit Trail**
- `EventLog` tracks all status changes
- Records actor, action, timestamp, and remarks
- Full approval workflow history

✅ **Notification System**
- Real-time notifications for status changes
- User read/unread tracking
- Notification deletion (soft delete via isDeleted flag)

---

## 📚 Learning Outcomes

This project demonstrates mastery of **backend engineering fundamentals**:

### 1. **Spring Boot & Dependency Injection**
- Multi-layered service architecture
- Autowiring and bean management
- Configuration classes and lifecycle

### 2. **RESTful API Design**
- Proper HTTP method usage (GET, POST, PUT, PATCH, DELETE)
- Request/response DTOs
- HTTP status codes and error handling
- API versioning ready

### 3. **Database Design & Optimization**
- Entity relationship modeling
- JPA/Hibernate ORM mastery
- Custom JPQL queries for performance
- N+1 query prevention via EntityGraph
- Index optimization for approval workflows

### 4. **Authentication & Authorization**
- JWT token generation and validation
- Role-based access control implementation
- SecurityFilterChain configuration
- Custom user details service

### 5. **Transaction Management**
- @Transactional annotation usage
- Cascade operations in relationships
- Orphan removal
- Lazy loading strategies

### 6. **Error Handling & Validation**
- Custom exception handling
- Bean validation annotations
- ResponseStatusException for HTTP responses
- Validation helper services

### 7. **Design Patterns**
- **Repository Pattern**: Data access abstraction
- **Service Layer Pattern**: Business logic encapsulation
- **DTO Pattern**: API contract definition
- **Mapper Pattern**: Entity ↔ DTO conversion
- **Helper Pattern**: Cross-cutting concerns

### 8. **External Integrations**
- Third-party API integration (Google Gemini)
- WebClient for reactive HTTP calls
- Supabase file storage integration
- CORS and external service communication

### 9. **Production-Ready Code**
- Secure password hashing
- Environment-specific configuration
- Comprehensive API documentation
- Clean code principles
- Code reusability via helpers and utils

---

## 🎯 Future Enhancements

### 1. **Advanced Analytics**
- Real-time event participation metrics
- Predictive analytics for attendance
- Custom dashboard filters and exports
- Business intelligence dashboards

### 2. **Enhanced Communication**
- Email notifications with event details
- SMS alerts for critical updates
- In-app real-time notifications (WebSocket)
- Event reminder system

### 3. **Event Discovery & Recommendation**
- Event search and filtering
- AI-powered event recommendations
- Event category exploration
- Trending events dashboard

### 4. **Payment Integration**
- Stripe/Razorpay integration for event fees
- Payment status tracking
- Refund management
- Financial reports

### 5. **Mobile Application**
- Native iOS/Android app
- Offline event access
- Push notifications
- QR-code-based check-in

### 6. **Advanced Security**
- Two-factor authentication (2FA)
- OAuth 2.0 / OpenID Connect integration
- Rate limiting and API throttling
- DDoS protection

### 7. **Scalability & Performance**
- Redis caching for frequently accessed data
- Database read replicas
- API response caching
- Background job queues (Kafka/RabbitMQ)
- CDN for file storage

### 8. **Multi-Tenancy Support**
- Support multiple educational institutions
- Tenant-isolated data
- Shared infrastructure efficiency

### 9. **Compliance & Auditing**
- GDPR compliance for user data
- Data retention policies
- Export data functionality
- Audit log retention

### 10. **AI Enhancements**
- AI-powered attendance tracking via facial recognition
- Chatbot for event queries
- Automated event summary generation
- Smart event scheduling recommendations

---

## 📞 Support & Contributing

- **Issue Reporting**: Create an issue on GitHub for bugs
- **Feature Requests**: Open a discussion for new features
- **Code Contributions**: Fork, create a feature branch, and submit a pull request

---

## 📝 License

This project is licensed under the **MIT License** - see LICENSE file for details.

---

## 👨‍💼 Project Information

**Developed for**: Campus event management and institutional coordination  
**Version**: 0.0.1-SNAPSHOT  
**Java Version**: 21  
**Spring Boot Version**: 3.5.7  
**Repository**: [TechByAniket/CampusUtsav-Backend](https://github.com/TechByAniket/CampusUtsav-Backend)  

---

## 🏆 For Recruiters & Interviewers

**What This Project Demonstrates**:

✅ **Full-Stack Backend Development**: RESTful APIs, databases, external integrations  
✅ **Enterprise Architecture**: Layered design, separation of concerns, scalability  
✅ **Security Expertise**: JWT auth, RBAC, password security, input validation  
✅ **Database Proficiency**: Complex relationships, query optimization, audit trails  
✅ **Problem-Solving**: Real-world problem (college coordination) solved systematically  
✅ **Code Quality**: Clean code, design patterns, best practices  
✅ **Third-Party Integration**: AI APIs, file storage, multi-service coordination  
✅ **Production Readiness**: Configuration management, error handling, logging  

**Interview Talking Points**:
- Multi-role authorization system with hierarchical approval workflows
- Event approval state machine and audit trail implementation
- N+1 query optimization using EntityGraph
- JWT token claims for distributed authorization
- Team-based event registration complexity
- JSONB usage for flexible attachment storage
- Transaction management in complex service operations

---

**Made with ❤️ for efficient college event management**
