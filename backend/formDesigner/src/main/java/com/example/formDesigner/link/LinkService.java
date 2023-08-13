package com.example.formDesigner.link;

import java.util.Optional;
import java.util.Random;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LinkService {

	private final LinkRepository linkRepository;
	
	@Autowired
	public LinkService(LinkRepository linkRepository) {
		this.linkRepository = linkRepository;
	}
	
	public JSONObject getLink(String key) {
		JSONObject response = new JSONObject();
		try {
			Link link = linkRepository.findByKey(key).get();
			String value = link.getValue();
			JSONObject responseData = new JSONObject();
			responseData.put("value", value);
			response.put("status", 1);
			response.put("data", responseData);
			return response;
		}catch(Exception e) {
			e.printStackTrace();
			response.put("status", 0);
			return response;
		}			
	}
	
	public JSONObject saveLink(Link link) {
		String key = generateRandomPassword(6);
		link.setKey(key);
		JSONObject response = new JSONObject();
		try {
			JSONObject responseData = new JSONObject();
			Link savedLink = linkRepository.save(link);
			responseData.put("key", key);
			response.put("status", 1);
			response.put("data", responseData);
			return response;
		} catch(Exception e) {
			e.printStackTrace();
			response.put("status", 0);
			return response;
		}
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
}
