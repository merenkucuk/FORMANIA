package com.example.formDesigner.submit;

import java.util.ArrayList;
import java.util.List;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SubmitService {

	private final SubmitRepository submitRepository;
	
	@Autowired
	public SubmitService(SubmitRepository submitRepository) {
		this.submitRepository = submitRepository;
	}
	
	public List<Submit> getAllSubmits(){
		return submitRepository.findAll();
	}
	
	public List<Submit> getSubmitsByFormId(String formId) {
		ArrayList<Submit> result = new ArrayList<Submit>();
		List<Submit> allSubmits = submitRepository.findAll();
		for(int i=0; i<allSubmits.size(); i++) {
			Submit submit = allSubmits.get(i);
			if(submit.getFormId().equals(Long.parseLong(formId))) {
				result.add(submit);
			}
		}
		return result;
	}
	
	public JSONObject getSubmitById(String submitId) {
		Submit submit = submitRepository.findById(Long.parseLong(submitId)).get();
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("id", submit.getId());
		jsonObject.put("formId", submit.getFormId());
		jsonObject.put("submitData", submit.getSubmitData());
		jsonObject.put("submitDate", submit.getSubmitDate());
		return jsonObject;
	}
	
	public JSONObject saveSubmit(Submit submit) {
		JSONObject response = new JSONObject();
		try {
			Submit savedSubmit = submitRepository.save(submit);
			JSONObject responseData = new JSONObject();
			responseData.put("id", savedSubmit.getId());
			response.put("status", 1);
			response.put("data", responseData);
			return response;
		}catch(Exception e) {
			e.printStackTrace();
			response.put("status", 0);
			return response;
		}
		
	}
}
