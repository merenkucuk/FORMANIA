package com.example.formDesigner.form;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "api/v1/form")
public class FormController {

	private final FormService formService;
	
	@Autowired
	public FormController(FormService formService) {
		this.formService = formService;
	}
	
	@GetMapping
	public List<Form> getAllForms(){
		return formService.getAllForms();
	}
	
	@GetMapping("/{formId}")
	@ResponseBody
	public JSONObject getFormById(@PathVariable String formId) {
		try {
			return formService.getFormById(formId);
		}catch(Exception e) {
			e.printStackTrace();
			JSONObject jsonObject = new JSONObject();
			jsonObject.put("message", "no such form.");
			return jsonObject;
		}
	}
	
	@GetMapping("/checkTime/{formId}")
	@ResponseBody
	public JSONObject checkFormEndDate(@PathVariable String formId) {
		try {
			return formService.checkFormEndDate(Long.parseLong(formId));
		}catch(Exception e) {
			e.printStackTrace();
			JSONObject jsonObject = new JSONObject();
			jsonObject.put("message", "no such form.");
			return jsonObject;
		}
	}
	
	@PostMapping
	public JSONObject saveForm(@RequestBody String formAsString) {
		JSONParser parser = new JSONParser();
		JSONObject jsonObject = null;
		try {
			jsonObject = (JSONObject) parser.parse(formAsString);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		LocalDateTime dateTime= null;
		if(jsonObject.get("formEndDate")!=null) {
			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss", Locale.getDefault());
			dateTime = LocalDateTime.parse((String)jsonObject.get("formEndDate"), formatter);
		}
		Form form = new Form((String)jsonObject.get("name"), jsonObject.get("formData").toString() , dateTime, (String)jsonObject.get("formPassword"));
		JSONObject response = formService.saveForm(form);
		return response;
	}
	
}
