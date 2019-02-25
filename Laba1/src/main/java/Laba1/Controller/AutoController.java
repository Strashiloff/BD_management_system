package Laba1.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AutoController {
    @GetMapping(value = "/auto")
    public String newPage()
    {
        return "auto.html";
    }
}
