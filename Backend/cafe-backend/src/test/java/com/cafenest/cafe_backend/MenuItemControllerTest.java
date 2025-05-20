package com.cafenest.cafe_backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class MenuItemControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @org.junit.jupiter.api.Test
    public void testGetAllMenuItems() throws Exception {
        mockMvc.perform(get("/api/menu"))
            .andExpect(status().isOk());
    }
}