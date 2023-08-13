package com.example.formDesigner.form;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FormService {

	private final FormRepository formRepository;
	
	@Autowired
	public FormService(FormRepository formRepository) {
		this.formRepository = formRepository;
	}
	
	public List<Form> getAllForms(){
		return formRepository.findAll();
	}
	
	public JSONObject getFormById(String formId) {
		Form form = formRepository.findById(Long.parseLong(formId)).get();
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("id", form.getId());
		jsonObject.put("name", form.getName());
		jsonObject.put("formLink", form.getFormLink());
		jsonObject.put("formEndDate", form.getFormEndDate());
		jsonObject.put("formPassword", form.getFormPassword());
		jsonObject.put("viewSubmitsPassword", form.getViewSubmitsPassword());
		jsonObject.put("formData", form.getFormData());
		return jsonObject;
	}
	
	public JSONObject saveForm(Form form) {
		String viewSubmitsPassword = generateRandomPassword(6);
		form.setViewSubmitsPassword(viewSubmitsPassword);
		String formLink = generateLink();
		form.setFormLink(formLink);
		JSONObject response = new JSONObject();
		try {
			Form savedForm = formRepository.save(form);
			JSONObject responseData = new JSONObject();
			responseData.put("formLink", formLink+savedForm.getId());
			responseData.put("viewSubmitsPassword", viewSubmitsPassword);
			response.put("status", 1);
			response.put("data", responseData);
			return response;
		}catch(Exception e) {
			e.printStackTrace();
			response.put("status", 0);
			return response;
		}
		
	}
	
	public String generateLink() {
		return "http://localhost:3000/formSubmit?formId=";
	}
	
	public String generateRandomPassword(int length) {
		String[] arr = {"a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","r","s","t","u","v","w","q","x","y","z",
				"0","1","2","3","4","5","6","7","8","9"};
		Random random = new Random();
		String result = "";
		for(var i=0; i<length; i++) {
			int rand_int = random.nextInt(36);
			result += arr[rand_int];
		}
		return result;
	}
	
	public JSONObject checkFormEndDate(long formId) {
		JSONObject response = new JSONObject();
		Form form = formRepository.findById(formId).get();
		LocalDateTime endDate = form.getFormEndDate();
		LocalDateTime now = LocalDateTime.now();
		if(compareDates(now, endDate)) {
			response.put("data", true);
		}else {
			response.put("data", false);
		}
		return response;
	}
	
	public boolean compareDates(LocalDateTime d1, LocalDateTime d2) {
		if (d1.isAfter(d2)) {
			return true;
		}else {
			return false;
		}
	}
}
