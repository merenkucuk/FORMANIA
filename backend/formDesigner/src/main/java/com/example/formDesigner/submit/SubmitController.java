package com.example.formDesigner.submit;

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
@RequestMapping(path = "api/v1/submit")
public class SubmitController {

	private final SubmitService submitService;
	
	@Autowired
	public SubmitController(SubmitService submitService) {
		this.submitService = submitService;
	}
	
	@GetMapping
	public List<Submit> getAllSubmits(){
		return submitService.getAllSubmits();
	}
	
	@GetMapping("/byFormId/{formId}")
	public List<Submit> getSubmitsByFormId(@PathVariable String formId){
		return submitService.getSubmitsByFormId(formId);
	}
	
	@GetMapping("/{submitId}")
	@ResponseBody
	public JSONObject getSubmitById(@PathVariable String submitId) {
		try {
			return submitService.getSubmitById(submitId);
		}catch(Exception e) {
			e.printStackTrace();
			JSONObject jsonObject = new JSONObject();
			jsonObject.put("message", "no such submit.");
			return jsonObject;
		}
	}
	
	@PostMapping
	public JSONObject saveSubmit(@RequestBody String submitAsString) {
		JSONParser parser = new JSONParser();
		JSONObject jsonObject = null;
		try {
			jsonObject = (JSONObject) parser.parse(submitAsString);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		Submit submit = new Submit(Long.parseLong(jsonObject.get("formId").toString()), jsonObject.get("submitData").toString() , jsonObject.get("submitDate").toString());
		JSONObject response = submitService.saveSubmit(submit);
		return response;
	}
}
