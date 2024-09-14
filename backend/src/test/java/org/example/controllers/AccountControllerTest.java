package org.example.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.example.repositories.UserRepository;
import org.example.service.AuthenticationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

public class AccountControllerTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private AuthenticationService authenticationService;
    @Mock
    private HttpServletRequest request;
    @Mock
    private HttpServletResponse response;
    private AccountController accountController;
    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        accountController = new AccountController(userRepository, authenticationService);
    }

    @Test
    public void testPreHandle_ValidAuthentication() throws Exception {

        when(authenticationService.checkAuthentication(request)).thenReturn(true);
        when(authenticationService.getCookieValue()).thenReturn("testCookieValue");

        boolean result = accountController.preHandle(request, response, new Object());
        assertTrue(result);

        verify(request).setAttribute("cookieValue", "testCookieValue");
        verify(response, never()).setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    }
}
